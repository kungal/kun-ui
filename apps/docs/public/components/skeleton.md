# Skeleton (骨架屏)

> 内容加载占位:text / rect / circle 形状,loaded 切换为真实内容,脉冲动画尊重 reduced-motion。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <KunSkeleton variant="text" width="60%" />
    <KunSkeleton variant="text" />
    <KunSkeleton variant="text" width="80%" />
  </div>
</template>
```

### Shapes.vue

```vue
<template>
  <div class="flex items-center gap-4">
    <KunSkeleton variant="circle" height="3rem" />
    <div class="flex flex-1 flex-col gap-2">
      <KunSkeleton variant="text" width="40%" />
      <KunSkeleton variant="text" width="70%" />
    </div>
    <KunSkeleton variant="rect" width="5rem" height="3rem" />
  </div>
</template>
```

### Loaded.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const loaded = ref(false)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-4">
    <KunButton size="sm" @click="loaded = !loaded">
      {{ loaded ? '重新加载' : '完成加载' }}
    </KunButton>
    <KunSkeleton :loaded="loaded" variant="rect" height="4rem">
      <KunCard class-name="w-full">
        <p class="font-medium">内容已就绪</p>
        <p class="text-default-500 text-sm">loaded 为 true 时渲染默认插槽。</p>
      </KunCard>
    </KunSkeleton>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `animation` | `"none" \| "pulse"` | `"pulse"` | Pulse animation (auto-disabled under prefers-reduced-motion); `none` to turn off. |
| `className` | `string` | `""` |  |
| `height` | `string` | `""` | CSS height. Defaults: text 1em, rect 1.25rem, circle 2.5rem. |
| `loaded` | `boolean` | `false` | When true, render the default slot (real content) instead of the placeholder. |
| `rounded` | `KunUIRounded` | — |  |
| `variant` | `"text" \| "circle" \| "rect"` | `"rect"` | Shape preset: `rect` block, `text` line, or `circle` (avatar). |
| `width` | `string` | `""` | CSS width. Defaults: rect/text 100%, circle = height. |

---
本页来源 · KunUI · https://ui.kungal.com/components/skeleton
