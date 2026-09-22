import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'KnowBase',
  description: '我的个人知识库',
  lastUpdated: true,

  // 内容目录在 docs/，而 .vitepress 配置留在项目根，
  // 因此必须显式指定 srcDir，否则 vitepress build 会把项目根当作内容目录
  srcDir: 'docs',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '中级经济师·人力', link: '/人力资源/' },
      { text: '系统架构图', link: '/autoapi-architecture.html' },
      {
        text: '相关链接',
        items: [
          { text: 'Cloudflare Pages 部署指南', link: '/notes/deploy' },
          { text: 'VitePress 官方文档', link: 'https://vitepress.dev/zh/' }
        ]
      }
    ],

    sidebar: [
      {
        text: '中级经济师 · 人力资源管理',
        collapsed: false,
        items: [
          { text: '刷题练习', link: '/quiz/' },
          { text: '栏目首页 · 考情分值总表', link: '/人力资源/' }
        ]
      },
      {
        text: '第一部分 人力资源与社会保险政策',
        collapsed: false,
        items: [
          { text: '第 1 章 劳动合同管理与特殊用工', link: '/人力资源/第01章-劳动合同管理与特殊用工' },
          { text: '第 2 章 社会保险法律（待整理）' },
          { text: '第 3 章 社会保险体系（待整理）' },
          { text: '第 4 章 劳动争议调解仲裁（待整理）' },
          { text: '第 5 章 法律责任与行政执法（待整理）' },
          { text: '第 6 章 人才管理与开发政策（待整理）' }
        ]
      },
      {
        text: '第二部分 人力资源管理专业理论',
        collapsed: true,
        items: [
          { text: '第 7 章 组织激励理论及其应用（待整理）' },
          { text: '第 8 章 领导行为理论及其应用（待整理）' },
          { text: '第 9 章 组织设计与组织文化（待整理）' },
          { text: '第 10 章 劳动力市场理论及其应用', link: '/人力资源/第10章-劳动力市场理论及其应用' },
          { text: '第 11 章 工资与就业理论及其应用（待整理）' },
          { text: '第 12 章 人力资本投资理论及其应用（待整理）' }
        ]
      },
      {
        text: '第三部分 人力资源管理实务',
        collapsed: true,
        items: [
          { text: '第 13 章 战略性人力资源管理（待整理）' },
          { text: '第 14 章 人力资源规划（待整理）' },
          { text: '第 15 章 甄选（待整理）' },
          { text: '第 16 章 绩效管理（待整理）' },
          { text: '第 17 章 薪酬管理（待整理）' },
          { text: '第 18 章 培训与开发（待整理）' },
          { text: '第 19 章 劳动关系（待整理）' }
        ]
      },
      {
        text: '知识库',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '系统架构图', link: '/autoapi-architecture.html' }
        ]
      },
      {
        text: '笔记',
        collapsed: false,
        items: [
          { text: 'Markdown 写作指南', link: '/notes/writing' },
          { text: 'GitHub + Cloudflare 部署', link: '/notes/deploy' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vveip/KnowBase' }
    ],

    footer: {
      message: '基于 VitePress 构建 · 部署于 Cloudflare Pages',
      copyright: 'Copyright © 2026-present KnowBase'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdatedText: '最后更新',

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
