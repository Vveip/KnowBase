---
title: Markdown 写作指南
description: VitePress 在标准 Markdown 之上的扩展语法速查
---

# Markdown 写作指南

VitePress 在标准 Markdown 之上做了一些扩展，写知识库非常顺手。

## 基础语法

```md
# 一级标题
## 二级标题

**加粗**、*斜体*、`行内代码`

- 无序列表
1. 有序列表

> 引用

[链接](https://example.com)
![图片](/images/demo.png)
```

## 代码块带高亮和行号

````md
```js{2,4-5}
export default {
  lang: 'zh-CN',     // 这一行高亮
  title: 'KnowBase',
  description: '我的知识库'  // 这几行也高亮
}
```
````

## 提示容器

```md
::: tip 提示
这是一条普通提示
:::

::: warning 警告
注意这里有坑
:::

::: danger 危险
千万别这么干
:::

::: info 信息
补充说明
:::
```

## 自定义容器

````md
::: details 点我查看代码
```js
console.log('hidden')
```
:::
````

## Frontmatter

每个 `.md` 文件顶部可以用 `---` 包裹元信息：

```md
---
title: 页面标题（覆盖侧边栏文字）
description: 页面描述
outline: deep        # 或 [2,3] / false 控制右侧大纲
lastUpdated: false   # 不显示最后更新时间
---
```

## 表格

```md
| 方案 | 成本 | 难度 |
| ---- | ---- | ---- |
| A    | 免费 | 简单 |
```

## 数学公式

```md
行内公式：$E = mc^2$

块级公式：
$$
\frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$
```

## 图片放在哪

统一放 `public/` 目录，引用时用绝对路径：

```
public/
└── images/
    └── demo.png      →  ![demo](/images/demo.png)
```

## 快捷键

| 操作 | 效果 |
| ---- | ---- |
| `Ctrl + K` | 打开搜索框 |
| `/` | 聚焦搜索框 |
| `g` 然后 `h` | 回到首页 |
| `g` 然后 `n` | 下一页 |
