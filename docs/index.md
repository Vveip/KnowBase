---
layout: home

hero:
  name: KnowBase
  text: 我的个人知识库
  tagline: 记录 · 整理 · 分享 —— 纯静态，零服务器，git push 即上线
  actions:
    - theme: brand
      text: 开始阅读
      link: /guide/getting-started
    - theme: alt
      text: 系统架构图
      link: /autoapi-architecture.html

features:
  - title: 纯静态托管
    details: Markdown 写作，构建成静态 HTML，不需要云服务器、不需要数据库，天然抗高并发。
  - title: 自动化部署
    details: 本地写完 git push，Cloudflare Pages 自动拉取代码、构建、发布到全球 CDN。
  - title: 本地全文搜索
    details: 内置 minisearch 本地搜索，索引构建在浏览器端，不依赖任何搜索服务。
  - title: 零成本
    details: GitHub 私有仓库免费 + Cloudflare Pages 免费额度，个人使用完全够用。
---

## 这是什么

一个用 [VitePress](https://vitepress.dev/zh/) 搭建的个人知识库，采用 **Jamstack** 架构：

```
本地写 Markdown ──► vitepress build ──► 静态 HTML ──► git push
                                                        │
                                              GitHub 仓库 (代码托管)
                                                        │
                                     Cloudflare Pages 自动拉取 + 构建 + 部署
                                                        │
                                        https://knowbase-6p1.pages.dev/
```

详细的搭建与部署过程见 [GitHub + Cloudflare 部署](/notes/deploy)。
