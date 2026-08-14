# Tooltip (文字提示)

> 围绕触发元素的悬停 / 聚焦提示,可定位到任意一侧。

## 示例

### Basic.vue

```vue
<template>
  <KunTooltip text="我是一个提示框">
    <KunButton variant="bordered">悬停我</KunButton>
  </KunTooltip>
</template>
```

### Placements.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunTooltip text="上方提示" position="top">
      <KunButton variant="bordered">上 top</KunButton>
    </KunTooltip>
    <KunTooltip text="右侧提示" position="right">
      <KunButton variant="bordered">右 right</KunButton>
    </KunTooltip>
    <KunTooltip text="下方提示" position="bottom">
      <KunButton variant="bordered">下 bottom</KunButton>
    </KunTooltip>
    <KunTooltip text="左侧提示" position="left">
      <KunButton variant="bordered">左 left</KunButton>
    </KunTooltip>
  </div>
</template>
```

### Arrow.vue

```vue
<template>
  <KunTooltip text="带箭头的提示" position="bottom" :show-arrow="true">
    <KunButton variant="bordered">悬停查看箭头</KunButton>
  </KunTooltip>
</template>
```

### LongContent.vue

```vue
<template>
  <KunTooltip
    text="这是一段很长的提示文字，当内容超过最大宽度 max-w-xs 时，文本会自动换行，而不会撑破容器或溢出屏幕。"
    position="top"
    :show-arrow="true"
  >
    <KunButton variant="bordered">悬停查看长内容</KunButton>
  </KunTooltip>
</template>
```

### RichContent.vue

```vue
<template>
  <KunTooltip position="top" :show-arrow="true">
    <KunButton variant="bordered" color="secondary">富内容提示</KunButton>
    <template #content>
      <div class="flex items-center gap-2">
        <KunIcon name="lucide:info" class="text-primary" />
        <span>通过 content 插槽自定义提示内容</span>
      </div>
    </template>
  </KunTooltip>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `delayHide` | `number` | `0` |
| `delayShow` | `number` | `100` |
| `hideOnMobile` | `boolean` | `true` |
| `position` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `showArrow` | `boolean` | `false` |
| `text` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/tooltip
