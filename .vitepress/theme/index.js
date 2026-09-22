import DefaultTheme from 'vitepress/theme'
import Quiz from './Quiz.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
  }
}
