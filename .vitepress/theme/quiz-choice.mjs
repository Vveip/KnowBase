/**
 * 选项字母属于题库内容：@answer 和部分解析会引用原始 A/B/C… 。
 * 不要单独打乱选项后重新编号，否则判分虽正确，答案和解析却指向不同的选项。
 * 题目顺序仍由 Quiz.vue 的 shuffle() 随机化。
 */
export function displayChoiceOptions(question) {
  return (question.options || []).map((option) => ({
    label: option.key,
    key: option.key,
    text: option.text
  }))
}

export function choiceAnswerText(question) {
  const textByKey = new Map((question.options || []).map((option) => [option.key, option.text]))
  return question.answer.map((key) => `${key}. ${textByKey.get(key) || ''}`).join('\n')
}
