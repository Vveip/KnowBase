# 快速开始

欢迎使用 KnowBase。这里记录日常开发中的技术笔记、架构设计与踩坑经验。

## 本地运行

```bash
# 安装依赖（首次）
npm install

# 启动本地开发服务器（默认 http://localhost:5173）
npm run docs:dev

# 构建静态站点到 .vitepress/dist
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

## 日常写作流程

1. 在 `docs/` 目录下新建 `.md` 文件，比如 `docs/notes/my-new-note.md`
2. 写完保存，`npm run docs:dev` 会**热更新**，浏览器即时看到效果
3. 满意后提交并推送：

```bash
git add .
git commit -m "docs: 新增 XXX 笔记"
git push
```

4. 等 1 分钟左右，线上站点自动更新

## 目录结构

```
D:\pi_home\
├── docs\                    # 所有 Markdown 内容
│   ├── index.md             # 首页（layout: home）
│   ├── guide\               # 指南
│   └── notes\               # 笔记
├── public\                  # 原样拷贝到站点根目录的静态文件
│   └── autoapi-architecture.html
├── .vitepress\
│   └── config.mjs           # 站点配置（导航、侧边栏、搜索等）
├── package.json
└── .gitignore
```

::: tip 关于 public 目录
放在 `public/` 里的文件会被**原封不动**复制到构建产物根目录。
比如 `public/autoapi-architecture.html` 构建后访问地址是
`https://knowbase-6p1.pages.dev/autoapi-architecture.html`。
适合放 archify 导出的独立 HTML、图片、PDF 等。
:::

## 常用配置修改

改导航、侧边栏、页脚：编辑 `.vitepress/config.mjs`

更多用法见 [Markdown 写作指南](/notes/writing)。
