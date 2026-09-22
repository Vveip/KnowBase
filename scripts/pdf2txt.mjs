/**
 * scripts/pdf2txt.mjs
 *
 * 把 cail 目录下的 PDF 批量提取为 UTF-8 纯文本，供知识库总结使用。
 * 依赖 pdf-parse 2.x（基于 pdfjs-dist 5.x）。
 *
 * 用法（在 D:\pi_home 目录下）：
 *
 *   npm install pdf-parse --no-fund --no-audit     # 仅首次
 *   node scripts\pdf2txt.mjs                        # 转换全部
 *   node scripts\pdf2txt.mjs 第1章                   # 只转换文件名含「第1章」的
 *
 * 输出：D:\pi_home\cail\txt\*.txt
 */

import fs from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

const SRC = path.join('D:', 'pi_home', 'cail');
const OUT = path.join(SRC, 'txt');

const filter = process.argv[2] || '';

if (!fs.existsSync(SRC)) {
  console.error(`[错误] 找不到目录：${SRC}`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => f.toLowerCase().endsWith('.pdf'))
  .filter((f) => (filter ? f.includes(filter) : true))
  .sort();

if (files.length === 0) {
  console.error(`[错误] ${SRC} 下没有匹配的 PDF（筛选条件："${filter}"）`);
  process.exit(1);
}

console.log(`待转换 ${files.length} 个 PDF，输出到 ${OUT}\n`);

let ok = 0;
let fail = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const src = path.join(SRC, file);
  const dest = path.join(OUT, file.replace(/\.pdf$/i, '') + '.txt');

  process.stdout.write(`[${String(i + 1).padStart(2)}/${files.length}] ${file} ... `);

  let parser;
  try {
    parser = new PDFParse({ data: fs.readFileSync(src) });
    const result = await parser.getText();
    const text = (result.text || '').replace(/\r\n/g, '\n').trim();

    if (text.length === 0) {
      console.log(`警告  共 ${result.total} 页但未抽出任何文字（可能是扫描版图片 PDF）`);
      fail++;
      continue;
    }

    fs.writeFileSync(dest, text, 'utf8');
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`OK  ${result.total} 页  ${kb} KB`);
    ok++;

    // 只转换单个文件时，打印开头片段便于人工检查中文是否正常
    if (files.length === 1) {
      console.log('\n---------- 开头预览 ----------');
      console.log(text.slice(0, 400));
      console.log('---------- 预览结束 ----------\n');
    }
  } catch (err) {
    console.log(`失败  ${err.message}`);
    fail++;
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch {
        /* 忽略关闭异常 */
      }
    }
  }
}

console.log(`完成：成功 ${ok} 个，失败 ${fail} 个。`);
console.log(`输出目录：${OUT}`);
