# Info (提示框)

> 带颜色、图标、标题与描述的内联提示框。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="primary" icon="lucide:info" title="Heads up" description="A primary info callout." />
    <KunInfo color="success" variant="flat" icon="lucide:circle-check" title="Success" description="Your changes were saved." />
    <KunInfo color="danger" variant="bordered" icon="lucide:circle-x" title="Error" description="Something went wrong." />
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="default" title="Default" description="默认中性提示。" />
    <KunInfo color="primary" title="Primary" description="主要信息提示。" />
    <KunInfo color="secondary" title="Secondary" description="次要信息提示。" />
    <KunInfo color="success" title="Success" description="操作成功完成。" />
    <KunInfo color="warning" title="Warning" description="需要注意的内容。" />
    <KunInfo color="danger" title="Danger" description="发生了错误。" />
    <KunInfo color="info" title="Info" description="一条普通的说明。" />
  </div>
</template>
```

### Variants.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="primary" variant="solid" title="Solid" description="实心填充背景。" />
    <KunInfo color="primary" variant="flat" title="Flat" description="柔和的浅色底（默认）。" />
    <KunInfo color="primary" variant="bordered" title="Bordered" description="描边边框样式。" />
  </div>
</template>
```

### TitleDescription.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <!-- title + description 通过属性传入 -->
    <KunInfo
      color="info"
      icon="lucide:info"
      title="发布说明"
      description="本次更新修复了若干已知问题并提升了性能。"
    />

    <!-- 默认插槽承载更丰富的描述内容 -->
    <KunInfo color="success" icon="lucide:circle-check" title="上传完成">
      文件已成功上传，你可以在
      <a class="underline" href="#">资源列表</a>
      中查看。
    </KunInfo>

    <!-- title 具名插槽自定义标题 -->
    <KunInfo color="warning" icon="lucide:triangle-alert">
      <template #title>
        <span class="font-semibold">存储空间不足</span>
      </template>
      剩余空间不足 10%，请及时清理。
    </KunInfo>
  </div>
</template>
```

### CustomIcon.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="primary" icon="lucide:eye" title="提示" description="使用 icon 属性传入已注册的图标名称。" />
    <KunInfo color="success" icon="lucide:download" title="下载就绪" description="点击即可下载文件。" />
    <KunInfo color="warning" icon="lucide:triangle-alert" title="警告" description="此操作不可撤销。" />
    <KunInfo color="danger" icon="lucide:circle-x" title="失败" description="请求未能完成。" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `description` | `string` | `""` |
| `icon` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |
| `title` | `string` | `""` |
| `variant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/info
