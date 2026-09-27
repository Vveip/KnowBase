import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { choiceAnswerText, displayChoiceOptions } from '../.vitepress/theme/quiz-choice.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const questions = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/quiz-data.json'), 'utf8'))

// 截图中的题曾把原始 A（统计性）显示在 C 位置，导致“正确答案：A”与绿色 C 冲突。
test('截图回归：源选项字母、实际展示、答案和解析对齐', () => {
  const question = questions.find((q) => q.id === 'c11-q023')
  assert.ok(question)
  const displayed = displayChoiceOptions(question)
  assert.deepEqual(displayed.map((o) => o.label), ['A', 'B', 'C', 'D'])
  assert.equal(displayed.find((o) => o.label === 'A').text, '统计性')
  assert.equal(choiceAnswerText(question), 'A. 统计性')
  assert.equal(question.answer[0], displayed.find((o) => o.text === '统计性').key)
})

test('题库所有选择题的显示字母与源答案保持一致', () => {
  const choices = questions.filter((q) => q.type === 'choice')
  assert.ok(choices.length > 0)
  for (const q of choices) {
    const displayed = displayChoiceOptions(q)
    const keys = displayed.map((o) => o.key)
    assert.equal(new Set(keys).size, keys.length, `${q.id}: 选项字母重复`)
    assert.deepEqual(keys, 'ABCDE'.slice(0, keys.length).split(''), `${q.id}: 选项字母未按原顺序排列`)
    assert.deepEqual(displayed.map((o) => o.label), keys, `${q.id}: 显示字母与源字母不一致`)
    assert.ok(q.answer.length > 0, `${q.id}: 答案为空`)
    assert.ok(q.answer.every((key) => keys.includes(key)), `${q.id}: 答案不在选项中`)
    const expected = q.answer.map((key) => `${key}. ${displayed.find((o) => o.key === key).text}`).join('\n')
    assert.equal(choiceAnswerText(q), expected, `${q.id}: 答案文字与显示选项不一致`)
  }
})

test('多选题保持原字母和原选项文字', () => {
  const q = { options: [{ key: 'A', text: '甲' }, { key: 'B', text: '乙' }, { key: 'C', text: '丙' }], answer: ['A', 'C'] }
  assert.deepEqual(displayChoiceOptions(q).map((o) => o.label), ['A', 'B', 'C'])
  assert.equal(choiceAnswerText(q), 'A. 甲\nC. 丙')
})

test('填空题和问答题不使用选项映射，题干和参考答案均非空', () => {
  const others = questions.filter((q) => q.type === 'blank' || q.type === 'qa')
  assert.ok(others.length > 0)
  for (const q of others) {
    assert.ok(q.question.trim(), `${q.id}: 题干为空`)
    assert.ok(q.answer.length > 0, `${q.id}: 答案为空`)
    assert.deepEqual(displayChoiceOptions(q), [], `${q.id}: 非选择题不应显示选项`)
  }
})
