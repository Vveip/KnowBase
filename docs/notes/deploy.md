---
title: GitHub + Cloudflare Pages 部署
description: 本地写完 git push 即上线的完整搭建与部署记录
---

# GitHub + Cloudflare Pages 部署

本文完整记录这个知识库是怎么做到 **"本地写完 → git push → 全球可访问"** 的。

## 整体架构

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│   本地电脑       │      │   GitHub         │      │  Cloudflare Pages  │
│                 │      │                  │      │                    │
│  docs/*.md  ────┼──────┼─► Vveip/KnowBase │──────┼─► 自动构建+部署     │
│  npm run build  │ push │   (代码仓库)      │ pull │   (全球 CDN)       │
└─────────────────┘      └──────────────────┘      └─────────┬──────────┘
                                                             │
                                              https://knowbase-6p1.pages.dev/
```

## 一、本地建仓库并推送到 GitHub

```bash
# 在项目根目录
git init -b main
git add .
git commit -m "init: 知识库初始版本"
git remote add origin https://github.com/Vveip/KnowBase.git
git push -u origin main
```

### 常见问题：GH007 邮箱隐私报错

```
remote: error: GH007: Your push would publish a private email address.
```

原因：commit 里用了 GitHub 账号的私有邮箱。解决办法——把作者邮箱换成 GitHub 匿名邮箱：

```bash
git config user.email "你的ID+用户名@users.noreply.github.com"
git commit --amend --reset-author --no-edit
git push -u origin main
```

完整地址在 https://github.com/settings/emails 页面可以复制到。

## 二、Cloudflare Pages 关联仓库

1. 登录 https://dash.cloudflare.com （免费注册）
2. 左侧 **Workers & Pages** → **Create application** → **Pages** 标签 → **Connect to Git**
3. 授权 GitHub，选中 `Vveip/KnowBase` 仓库
4. 按下表填写构建配置：

| 配置项 | 值 |
|---|---|
| Project name | `knowbase-6p1`（决定域名前缀） |
| Production branch | `main` |
| Framework preset | `VitePress` |
| Build command | `npm run docs:build` |
| Build output directory | `.vitepress/dist` |
| Root directory | 留空 |

5. 点 **Save and Deploy**，等 1～2 分钟

> 如果构建失败提示 Node 版本问题，在 **Settings → Functions → Compatibility → Node.js version** 里改成 `22`，与本地保持一致。

## 三、访问地址

- 线上地址：<https://knowbase-6p1.pages.dev/>
- 独立页面：`https://knowbase-6p1.pages.dev/autoapi-architecture.html`

把链接发给任何人即可直接打开，无需安装任何东西。

## 四、GitHub Pages 作为备用

同一个仓库可以同时开启 GitHub Pages（Settings → Pages → Deploy from a branch → `main` / root）：

- 地址：`https://vveip.github.io/KnowBase/`
- 但 VitePress 产物在 `.vitepress/dist`，所以 GitHub Pages 的 root 分支模式下无法直接访问知识库，只能作为静态文件备用

仓库里放了一个空的 `.nojekyll` 文件，告诉 GitHub Pages 跳过 Jekyll 处理，避免 `_` 开头的文件被忽略。

## 五、以后怎么更新

```bash
git add .
git commit -m "docs: 更新内容"
git push
```

Cloudflare Pages 检测到 push 会自动重新构建部署，无需任何其他操作。**零服务器、零成本。**

## 六、绑定自己的域名（可选）

Pages 项目 → **Custom domains** → **Set up a domain** → 输入域名 → 按提示把域名的 NS 或 DNS 记录指向 Cloudflare 即可，HTTPS 证书自动签发。绑自己的域名后国内访问会明显比 `pages.dev` 稳定。
