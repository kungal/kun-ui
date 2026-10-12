# Skeleton (骨架屏)

> 内容加载占位:text / rect / circle 形状,loaded 切换为真实内容,脉冲动画尊重 reduced-motion。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-sm flex-col">
    <KunSkeleton variant="text" width="60%" />
    <KunSkeleton variant="text" />
    <KunSkeleton variant="text" width="80%" />
  </div>
</template>
```

### Shapes.vue

```vue
<template>
  <div class="flex w-full max-w-sm items-center gap-4">
    <KunSkeleton variant="circle" height="3rem" />
    <div class="flex flex-1 flex-col">
      <KunSkeleton variant="text" width="40%" />
      <KunSkeleton variant="text" width="70%" class-name="text-sm" />
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
    <div class="w-full" aria-live="polite" :aria-busy="!loaded">
      <KunSkeleton :loaded="loaded" variant="rect" height="4rem">
        <KunCard class-name="w-full">
          <p class="font-medium">内容已就绪</p>
          <p class="text-foreground-muted text-sm">loaded 为 true 时渲染默认插槽。</p>
        </KunCard>
      </KunSkeleton>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `animation` | `"none" \| "pulse"` | `"pulse"` | Pulse animation (auto-disabled under prefers-reduced-motion); `none` to turn off. |
| `className` | `string` | `""` |  |
| `height` | `string` | `""` | CSS height. Defaults: text one line box (`1lh`) with a `1em` bar centred in it, rect 1.25rem, circle 2.5rem. An explicit height on `text` is the bar's own height, with no line box around it. |
| `loaded` | `boolean` | `false` | When true, render the default slot (real content) instead of the placeholder. |
| `rounded` | `KunUIRounded` | — |  |
| `variant` | `"text" \| "circle" \| "rect"` | `"rect"` | Shape preset: `rect` block, `text` line, or `circle` (avatar). A `text` placeholder is one line box of the font it inherits, so give it the text classes of the content it stands in for (`class-name="text-sm"`) and stack the lines of one paragraph without a gap. |
| `width` | `string` | `""` | CSS width. Defaults: rect/text 100%, circle = height. |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/skeleton
