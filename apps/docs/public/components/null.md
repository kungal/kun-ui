# Null (空状态)

> 空状态占位,内置看板娘图片与文案。

## 示例

### Basic.vue

```vue
<template>
  <!-- 空状态占位，内置吉祥物图片与默认文案。 -->
  <KunNull />
</template>
```

### Description.vue

```vue
<template>
  <!-- 通过 description 自定义空状态文案。 -->
  <KunNull description="还没有任何评论，快来抢沙发吧～" />
</template>
```

### NoSticker.vue

```vue
<template>
  <!-- isShowSticker=false 隐藏图片，只保留纯文本空状态。 -->
  <KunNull :is-show-sticker="false" description="暂无数据" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `"莲说这里什么都没有"` |  |
| `isShowSticker` | `boolean` | `true` | Show the empty-state image. Default true. |
| `src` | `string` | `KUN_NULL_IMAGE` | The empty-state image. Defaults to a bundled mascot (base64 data URI — no network/CDN request). Pass any URL or data URI to override. |

---
本页来源 · KunUI · https://ui.kungal.com/components/null
