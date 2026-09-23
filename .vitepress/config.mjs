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

  // 只留在本地、不对外发布的页面：不参与构建，线上无法访问，也不会进本地搜索索引
  srcExclude: ['**/notes/deploy.md'],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '中级经济师',
        items: [
          { text: '人力资源管理（19 章）', link: '/人力资源/' },
          { text: '工商管理（11 章）', link: '/工商管理/' },
          { text: '财政税收（7 章）', link: '/财政税收/' },
          { text: '备考总览 · 速记手册', link: '/经济师备考/' },
          { text: '刷题练习', link: '/quiz/' }
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
          { text: '第 2 章 社会保险法律', link: '/人力资源/第2章-社会保险法律' },
          { text: '第 3 章 社会保险体系', link: '/人力资源/第3章-社会保险体系' },
          { text: '第 4 章 劳动争议调解仲裁', link: '/人力资源/第4章-劳动争议调解仲裁' },
          { text: '第 5 章 法律责任与行政执法', link: '/人力资源/第5章-法律责任与行政执法' },
          { text: '第 6 章 人才管理与开发政策', link: '/人力资源/第6章-人才管理与开发政策' }
        ]
      },
      {
        text: '第二部分 人力资源管理专业理论',
        collapsed: true,
        items: [
          { text: '第 7 章 组织激励理论及其应用', link: '/人力资源/第7章-组织激励理论及其应用' },
          { text: '第 8 章 领导行为理论及其应用', link: '/人力资源/第8章-领导行为理论及其应用' },
          { text: '第 9 章 组织设计与组织文化', link: '/人力资源/第9章-组织设计与组织文化概述及其应用' },
          { text: '第 10 章 劳动力市场理论及其应用', link: '/人力资源/第10章-劳动力市场理论及其应用' },
          { text: '第 11 章 工资与就业理论及其应用', link: '/人力资源/第11章-工资与就业理论及其应用' },
          { text: '第 12 章 人力资本投资理论及其应用', link: '/人力资源/第12章-人力资本投资理论及其应用' }
        ]
      },
      {
        text: '第三部分 人力资源管理实务',
        collapsed: true,
        items: [
          { text: '第 13 章 战略性人力资源管理', link: '/人力资源/第13章-战略性人力资源管理' },
          { text: '第 14 章 人力资源规划', link: '/人力资源/第14章-人力资源规划' },
          { text: '第 15 章 甄选', link: '/人力资源/第15章-甄选' },
          { text: '第 16 章 绩效管理', link: '/人力资源/第16章-绩效管理' },
          { text: '第 17 章 薪酬管理', link: '/人力资源/第17章-薪酬管理' },
          { text: '第 18 章 培训与开发', link: '/人力资源/第18章-培训与开发' },
          { text: '第 19 章 劳动关系', link: '/人力资源/第19章-劳动关系' }
        ]
      },
      {
        text: '中级经济师 · 工商管理',
        collapsed: false,
        items: [
          { text: '刷题练习', link: '/quiz/' },
          { text: '栏目首页 · 考情与结构', link: '/工商管理/' },
          { text: '第 1 章 企业战略与经营决策', link: '/工商管理/第1章-企业战略与经营决策' },
          { text: '第 2 章 公司法人治理结构', link: '/工商管理/第2章-公司法人治理结构' },
          { text: '第 3 章 市场营销与品牌管理', link: '/工商管理/第3章-市场营销与品牌管理' },
          { text: '第 4 章 分销渠道管理', link: '/工商管理/第4章-分销渠道管理' },
          { text: '第 5 章 生产管理', link: '/工商管理/第5章-生产管理' },
          { text: '第 6 章 物流管理', link: '/工商管理/第6章-物流管理' },
          { text: '第 7 章 技术创新管理', link: '/工商管理/第7章-技术创新管理' },
          { text: '第 8 章 人力资源规划与薪酬管理', link: '/工商管理/第8章-人力资源规划与薪酬管理' },
          { text: '第 9 章 企业投融资决策及并购重组', link: '/工商管理/第9章-企业投融资决策及并购重组' },
          { text: '第 10 章 电子商务', link: '/工商管理/第10章-电子商务' },
          { text: '第 11 章 国际商务运营', link: '/工商管理/第11章-国际商务运营' }
        ]
      },
      {
        text: '工商管理 · 真题与冲刺',
        collapsed: true,
        items: [
          { text: '2026年真题速攻考点归纳', link: '/工商管理/2026年真题速攻考点归纳' },
          {
            text: '历年真题考点（2017—2025）',
            link: '/工商管理/历年真题/',
            collapsed: true,
            items: [
              { text: '2017年真题考点', link: '/工商管理/历年真题/2017年真题考点' },
              { text: '2018年真题考点', link: '/工商管理/历年真题/2018年真题考点' },
              { text: '2019年真题考点', link: '/工商管理/历年真题/2019年真题考点' },
              { text: '2020年真题考点', link: '/工商管理/历年真题/2020年真题考点' },
              { text: '2021年真题考点', link: '/工商管理/历年真题/2021年真题考点' },
              { text: '2022年真题考点', link: '/工商管理/历年真题/2022年真题考点' },
              { text: '2023年真题考点', link: '/工商管理/历年真题/2023年真题考点' },
              { text: '2024年真题考点', link: '/工商管理/历年真题/2024年真题考点' },
              { text: '2025年真题考点', link: '/工商管理/历年真题/2025年真题考点' }
            ]
          }
        ]
      },
      {
        text: '中级经济师 · 财政税收',
        collapsed: false,
        items: [
          { text: '刷题练习', link: '/quiz/' },
          { text: '栏目首页 · 考情与结构', link: '/财政税收/' },
          { text: '第 1 章 公共物品与财政理论', link: '/财政税收/第1章-公共物品与财政理论' },
          { text: '第 2 章 财政支出', link: '/财政税收/第2章-财政支出' },
          { text: '第 3 章 税收理论', link: '/财政税收/第3章-税收理论' },
          { text: '第 4 章 货物和劳务税制度', link: '/财政税收/第4章-货物和劳务税制度' },
          { text: '第 5 章 所得税制度', link: '/财政税收/第5章-所得税制度' },
          { text: '第 6 章 财产税制度', link: '/财政税收/第6章-财产税制度' },
          { text: '第 7 章 税务管理', link: '/财政税收/第7章-税务管理' }
        ]
      },
      {
        text: '中级经济师 · 备考资料（跨专业）',
        collapsed: true,
        items: [
          { text: '备考总览 · 考试安排与三轮复习法', link: '/经济师备考/' },
          { text: '公式与计算手册', link: '/经济师备考/公式与计算手册' },
          { text: '数字与比例速记手册', link: '/经济师备考/数字与比例速记手册' },
          { text: '易混易错对比手册', link: '/经济师备考/易混易错对比手册' }
        ]
      },
      {
        text: '知识库',
        items: [
          { text: '快速开始', link: '/guide/getting-started' }
        ]
      },
      {
        text: '笔记',
        collapsed: false,
        items: [
          { text: 'Markdown 写作指南', link: '/notes/writing' }
        ]
      }
    ],

    // 只保留图标，不指向本项目仓库
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '基于 VitePress 构建',
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
