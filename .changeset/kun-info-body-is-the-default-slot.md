---
'@kungal/ui-vue': patch
---

KunInfo:补齐 props 文档,写清楚「描述区就是默认插槽」

下游报 KunInfo 没有 `description` 插槽。查过了,这是**预期行为**:KunInfo 只有两个插入点 —— 标题(`title` 具名插槽)和正文(默认插槽),与 `KunAccordionItem`、`KunTimelineItem` 同构。库里唯一带 `description` 具名插槽的是 `KunHeader`,因为它根本没有默认插槽,四个插入点必须全部具名。

坑在于 **Vue 对匹配不上的具名插槽是静默丢弃的**,没有任何 dev warning。所以 `<template #description>` 写下去什么都不渲染,看起来就像功能缺失,而不是写错了名字。正确写法:

```vue
<KunInfo color="success" icon="lucide:circle-check" title="上传完成">
  文件已成功上传,你可以在 <a class="underline" href="#">资源列表</a> 中查看。
</KunInfo>
```

`description` 属性和默认插槽可以同时用,描述段落在上、插槽内容在下。

运行时没有任何改动。这一版补的是我们这边的文档欠债:

- `KunInfoProps` 之前一条 JSDoc 都没有,文档站 PropsTable 里只有名字和类型。现在每个 prop 都有说明,`description` 那条直接点明富文本走默认插槽 —— 编辑器悬浮提示也能看到。
- `llms.txt` 里的 KunInfo 一行没提默认插槽,而 `KunTimelineItem`、`KunAccordionItem` 都提了。照着 AI 生成代码的下游没有任何途径知道它的存在,猜 `#description` 几乎是必然。现在补上了。
