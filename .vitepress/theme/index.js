import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Quiz from './Quiz.vue'
import MobileQuizShortcut from './MobileQuizShortcut.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(MobileQuizShortcut)
    })
  },
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
  }
}
