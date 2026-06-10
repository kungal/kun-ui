# Popover (气泡卡片)

> 锚定在触发槽上的浮层面板。

## 示例

### Basic.vue

```vue
<template>
  <KunPopover>
    <template #trigger>
      <KunButton variant="bordered">Open popover</KunButton>
    </template>
    <div class="p-3 text-sm">
      <p class="font-medium">Popover content</p>
      <p class="text-default-600 mt-1">Anchored to the trigger; floating-ui positioned.</p>
    </div>
  </KunPopover>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `autoPosition` | `boolean` | `false` |
| `innerClass` | `string` | `""` |
| `position` | `KunPopoverPosition` | `"bottom-start"` |
| `rounded` | `KunUIRounded` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/popover
