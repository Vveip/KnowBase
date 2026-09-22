// scripts/gen-quiz.mjs
// 扫描 docs/**/*.md，抽取所有 ```quiz 代码块，输出 .vitepress/quiz-data.json
//
// 设计原则（见任务清单 T1.1）：
//   - 绝不 throw：任何单块解析失败只 warn 并跳过
//   - 始终写出合法 JSON（哪怕空数组）
//   - 检测 id 重复，保留第一个
//
// 用法：node scripts/gen-quiz.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'docs')
const OUT_FILE = path.join(ROOT, '.vitepress', 'quiz-data.json')

const SKIP_DIRS = new Set(['node_modules', '.git', '.vitepress', 'dist', 'cache'])

/* ------------------------------------------------------------------ */
/* 工具函数                                                             */
/* ------------------------------------------------------------------ */

/** 递归收集目录下所有 .md 文件（相对 ROOT 的 POSIX 路径） */
function collectMarkdown(dir, out = []) {
  let entries = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch (err) {
    console.warn(`[warn] 无法读取目录 ${dir}：${err.message}`)
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue
      collectMarkdown(full, out)
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      out.push(path.relative(ROOT, full).split(path.sep).join('/'))
    }
  }
  return out
}

/** 解析 markdown 文件头部的 frontmatter（只取简单 key: value） */
function parseFrontmatter(text) {
  const meta = {}
  const m = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return meta
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx <= 0) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    value = value.replace(/^["']|["']$/g, '')
    if (key) meta[key] = value
  }
  return meta
}

/**
 * 按行扫描，抽出所有 ```quiz 代码块的内容。
 * 用行扫描而不是全局正则，避免块内出现 ``` 时错位。
 */
function extractQuizBlocks(text) {
  const lines = text.split(/\r?\n/)
  const blocks = []
  let inside = false
  let startLine = 0
  let buf = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})\s*([^\s`]*)\s*$/)
    if (!inside) {
      if (fence && fence[1].startsWith('`') && fence[2].toLowerCase() === 'quiz') {
        inside = true
        startLine = i + 1
        buf = []
      }
      continue
    }
    // 已经在 quiz 块内：遇到任意围栏即结束
    if (fence) {
      blocks.push({ startLine, content: buf.join('\n') })
      inside = false
      buf = []
      continue
    }
    buf.push(line)
  }
  if (inside) {
    // 没有闭合围栏：仍然收下，交给解析器判断
    console.warn(`[warn] 第 ${startLine} 行起的 quiz 块缺少闭合围栏，已按文件末尾截断`)
    blocks.push({ startLine, content: buf.join('\n') })
  }
  return blocks
}

/** 全角 → 半角 + 去空白去标点，用于 blank 题答案比较 */
function normalizeAnswer(value) {
  return String(value || '')
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, ' ')
    .replace(/[\s，。、；：""''（）()【】\[\]《》,.;:!?！？"'`~·\-—_/\\|]/g, '')
    .toLowerCase()
}

/** 把 @answer 原文归一化成结构化答案 */
function normalizeByType(type, raw) {
  const text = String(raw || '').trim()
  if (type === 'blank') {
    return text
      .split(/[|｜;；]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (type === 'choice') {
    const letters = text.toUpperCase().match(/[A-E]/g) || []
    return [...new Set(letters)]
  }
  return text // qa 保留原字符串
}

/* ------------------------------------------------------------------ */
/* 单块解析                                                             */
/* ------------------------------------------------------------------ */

const OPTION_RE = /^\s{0,3}([A-Ea-e])\s*[.．、)）:：]\s*(.+?)\s*$/

function parseBlock(content, ctx) {
  // 1) 分离块内 frontmatter 与 body
  let front = ''
  let body = content
  const fm = content.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (fm) {
    front = fm[1]
    body = fm[2]
  }

  const meta = {}
  for (const raw of front.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx <= 0) continue
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }

  // 2) 逐行拆 body：题干 / 选项 / @answer / @explanation
  const lines = body.split(/\r?\n/)
  const questionLines = []
  const options = []
  let answerRaw = ''
  let explanationLines = []
  let mode = 'question'

  for (const line of lines) {
    const trimmed = line.trim()

    const ansMatch = trimmed.match(/^@answer\b[ \t]*(.*)$/)
    if (ansMatch) {
      mode = 'answer'
      answerRaw = ansMatch[1]
      continue
    }
    const expMatch = trimmed.match(/^@explanation\b[ \t]*(.*)$/)
    if (expMatch) {
      mode = 'explanation'
      explanationLines = [expMatch[1]]
      continue
    }
    if (/^@\w+/.test(trimmed)) {
      // 未知指令，忽略其内容
      mode = 'other'
      continue
    }

    if (mode === 'answer') {
      if (trimmed) answerRaw += (answerRaw ? '\n' : '') + trimmed
      continue
    }
    if (mode === 'explanation') {
      explanationLines.push(line.replace(/\s+$/, ''))
      continue
    }
    if (mode === 'other') continue

    const optMatch = line.match(OPTION_RE)
    if (optMatch) {
      mode = 'options'
      options.push({ key: optMatch[1].toUpperCase(), text: optMatch[2].trim() })
      continue
    }
    if (mode === 'options') {
      if (!trimmed) continue
      // 选项换行续行：拼到上一个选项
      if (options.length) options[options.length - 1].text += trimmed
      continue
    }
    questionLines.push(line)
  }

  const question = questionLines.join('\n').trim()
  const explanation = explanationLines.join('\n').trim()

  const type = (meta.type || '').toLowerCase()
  if (!['choice', 'blank', 'qa'].includes(type)) {
    throw new Error(`未知 type：${meta.type || '(空)'}`)
  }
  if (!question) throw new Error('题干为空')
  if (type === 'choice' && options.length < 2) throw new Error('选项少于 2 个')
  if (type === 'choice' && !String(answerRaw).trim()) throw new Error('缺少 @answer')

  const answer = normalizeByType(type, answerRaw)
  if (type === 'choice' && answer.length === 0) throw new Error('@answer 中没有 A–E 选项字母')

  const chapterMatch = ctx.file.match(/第(\d+)章/)
  const chapter = chapterMatch ? Number(chapterMatch[1]) : null

  return {
    id: meta.id || `auto-${ctx.fileSlug}-${ctx.index}`,
    type,
    category: ctx.category,
    difficulty: Number(meta.difficulty) || 2,
    source: meta.source || '',
    question,
    options,
    answer,
    answerRaw: String(answerRaw || '').trim(),
    explanation,
    chapter,
    file: ctx.file,
    line: ctx.line
  }
}

/* ------------------------------------------------------------------ */
/* 主流程                                                               */
/* ------------------------------------------------------------------ */

function main() {
  const files = collectMarkdown(SRC_DIR)
  const questions = []
  const seenIds = new Map()
  const skipped = []

  for (const file of files) {
    let text = ''
    try {
      text = fs.readFileSync(path.join(ROOT, file), 'utf8')
    } catch (err) {
      console.warn(`[warn] 读取失败 ${file}：${err.message}`)
      continue
    }

    const docMeta = parseFrontmatter(text)
    const category = docMeta.title || path.basename(file, '.md')
    const fileSlug = path.basename(file, '.md').replace(/[^\w\u4e00-\u9fa5]+/g, '-')

    const blocks = extractQuizBlocks(text)
    if (!blocks.length) continue

    blocks.forEach((block, index) => {
      const ctx = { file, category, fileSlug, index: index + 1, line: block.startLine }
      let parsed
      try {
        parsed = parseBlock(block.content, ctx)
      } catch (err) {
        skipped.push({ file, line: block.startLine, reason: err.message })
        console.warn(`[warn] 跳过 ${file}:${block.startLine} — ${err.message}`)
        return
      }

      if (seenIds.has(parsed.id)) {
        console.warn(
          `[warn] id 重复：${parsed.id}（${file}:${block.startLine}），保留第一个（${seenIds.get(parsed.id)}）`
        )
        skipped.push({ file, line: block.startLine, reason: `id 重复：${parsed.id}` })
        return
      }
      seenIds.set(parsed.id, `${file}:${block.startLine}`)
      questions.push(parsed)
    })
  }

  // 排序：先按章节，再按 id，保证输出稳定（方便 git diff）
  questions.sort((a, b) => {
    const ca = a.chapter ?? 999
    const cb = b.chapter ?? 999
    if (ca !== cb) return ca - cb
    return a.id.localeCompare(b.id, 'zh-CN')
  })

  try {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
    fs.writeFileSync(OUT_FILE, JSON.stringify(questions, null, 2) + '\n', 'utf8')
  } catch (err) {
    console.error(`[error] 写出 ${OUT_FILE} 失败：${err.message}`)
    process.exitCode = 1
    return
  }

  // ---- 统计输出 ----
  const byType = {}
  const byChapter = {}
  for (const q of questions) {
    byType[q.type] = (byType[q.type] || 0) + 1
    const key = q.chapter ? `第${q.chapter}章` : '(未识别章节)'
    byChapter[key] = (byChapter[key] || 0) + 1
  }

  console.log(`扫描文件：${files.length} 个 markdown`)
  console.log(`共解析 ${questions.length} 题 → ${path.relative(ROOT, OUT_FILE)}`)
  console.log(`题型分布：${Object.entries(byType).map(([k, v]) => `${k}=${v}`).join('  ') || '(空)'}`)
  console.log(
    `章节分布：${Object.entries(byChapter)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join('  ') || '(空)'}`
  )
  if (skipped.length) {
    console.log(`跳过 ${skipped.length} 块：`)
    for (const s of skipped) console.log(`  - ${s.file}:${s.line} → ${s.reason}`)
  } else {
    console.log('跳过 0 块')
  }
}

try {
  main()
} catch (err) {
  console.error(`[error] 抽取题库失败（已尽量保证不中断）：${err && err.stack ? err.stack : err}`)
  try {
    if (!fs.existsSync(OUT_FILE)) fs.writeFileSync(OUT_FILE, '[]\n', 'utf8')
  } catch {}
  process.exitCode = 1
}
