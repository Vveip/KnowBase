import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

// 只检查导航配置文本；直接在 node:test 加载 VitePress 会依赖本机 Rollup 原生模块。
const source = fs.readFileSync(new URL('../.vitepress/config.mjs', import.meta.url), 'utf8')
const nav = source.split('    nav: [')[1]?.split('    sidebar: {')[0]

// 仅求值本地配置对象，绕开测试环境中缺失的 Rollup Linux 原生模块。
const config = vm.runInNewContext(
  source.replace(/^import \{ defineConfig \} from 'vitepress'\s*/, '').replace('export default defineConfig(', 'defineConfig('),
  { defineConfig: value => value }
)

test('刷题练习是紧随中级经济师的独立导航入口，且下拉不再重复', () => {
  assert.ok(nav, '未找到站点导航配置')
  assert.match(nav, /\}\s*,\s*\{ text: '刷题练习', link: '\/quiz\/' \}/)
  assert.equal([...nav.matchAll(/link: '\/quiz\/'/g)].length, 1)
})

test('各栏目只显示自己的章节，跨专业资料与刷题页不混入专业侧栏', () => {
  const sidebar = config.themeConfig.sidebar
  const expected = {
    '/人力资源/': 20,
    '/工商管理/': 12,
    '/财政税收/': 13,
    '/经济基础/': 38,
    '/经济师备考/': 4,
    '/guide/': 1,
    '/notes/': 1
  }

  for (const [prefix, count] of Object.entries(expected)) {
    const groups = sidebar[prefix]
    assert.ok(Array.isArray(groups) && groups.length, `${prefix} 应有独立侧边栏`)
    const links = groups.flatMap(group => group.items.map(item => item.link))
    assert.equal(links.length, count, `${prefix} 章节数发生变化`)
    for (const link of links) {
      assert.ok(link.startsWith(prefix), `${prefix} 混入其他栏目链接：${link}`)
      const file = new URL(`../docs${link}${link.endsWith('/') ? 'index' : ''}.md`, import.meta.url)
      assert.ok(fs.existsSync(file), `侧边栏链接失效：${link}`)
    }
  }

  assert.deepEqual([...sidebar['/quiz/']], [], '刷题页应留出答题空间')
  assert.equal(sidebar['/'], undefined, '首页不应展示章节侧边栏')
  assert.equal(config.srcDir, 'docs')
  assert.ok(config.srcExclude.includes('**/notes/deploy.md'))
})
