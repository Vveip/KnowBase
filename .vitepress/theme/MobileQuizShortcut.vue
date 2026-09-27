<script setup>
import { useData, withBase } from 'vitepress'

const { page } = useData()
</script>

<template>
  <a
    class="mobile-quiz-shortcut"
    :href="withBase('/quiz/')"
    :aria-current="page.relativePath === 'quiz/index.md' ? 'page' : undefined"
    aria-label="进入刷题练习"
  >刷题</a>
</template>

<style scoped>
.mobile-quiz-shortcut {
  display: none;
}

/* 窄屏时默认导航被收进汉堡菜单，单独留一个始终可点的刷题入口。 */
@media (max-width: 767px) {
  .mobile-quiz-shortcut {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    min-height: 44px;
    padding: 0 8px;
    border-radius: 8px;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }

  .mobile-quiz-shortcut[aria-current='page'] {
    background: var(--vp-c-brand-1);
    color: var(--vp-c-white);
  }

  .mobile-quiz-shortcut:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
  }
}
</style>
