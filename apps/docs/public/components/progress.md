# Progress (进度条)

> 进度条:实心 / 条纹 / 渐变 / 环形,支持不确定态与标签。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <KunProgress :value="25" />
    <KunProgress :value="50" />
    <KunProgress :value="75" />
    <KunProgress :value="100" />
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <KunProgress :value="60" color="default" />
    <KunProgress :value="60" color="primary" />
    <KunProgress :value="60" color="secondary" />
    <KunProgress :value="60" color="success" />
    <KunProgress :value="60" color="warning" />
    <KunProgress :value="60" color="danger" />
    <KunProgress :value="60" color="info" />
  </div>
</template>
```

### Variants.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <!-- solid（默认）、striped 条纹、gradient 渐变 -->
    <KunProgress :value="65" variant="solid" color="primary" />
    <KunProgress :value="65" variant="striped" color="success" />
    <KunProgress :value="65" variant="gradient" color="secondary" />
  </div>
</template>
```

### Circle.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-6">
    <KunProgress :value="25" variant="circle" color="primary" show-label aria-label="进度 25%" />
    <KunProgress :value="60" variant="circle" color="success" show-label aria-label="进度 60%" />
    <KunProgress :value="90" variant="circle" color="warning" show-label aria-label="进度 90%" />
  </div>
</template>
```

### Indeterminate.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <!-- 进度未知时，使用不定态：进度条来回滑动 -->
    <KunProgress indeterminate color="primary" aria-label="加载中" />
    <KunProgress indeterminate variant="circle" color="secondary" aria-label="加载中" />
  </div>
</template>
```

### WithLabel.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const progress = ref(40)
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <!-- show-label 在进度条内（或圆环中心）显示百分比 -->
    <KunProgress :value="progress" size="lg" show-label color="primary" />
    <KunProgress :value="progress" variant="circle" color="primary" show-label aria-label="进度" />

    <div class="flex gap-2">
      <KunButton size="sm" variant="bordered" @click="progress = Math.max(0, progress - 20)">-20</KunButton>
      <KunButton size="sm" @click="progress = Math.min(100, progress + 20)">+20</KunButton>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | `""` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `indeterminate` | `boolean` | `false` |
| `max` | `number` | `100` |
| `rounded` | `KunUIRounded` | — |
| `showLabel` | `boolean` | `false` |
| `size` | `KunUISize` | `"md"` |
| `value` | `number` | `0` |
| `variant` | `KunUIVariant \| "gradient" \| "circle" \| "striped"` | `"solid"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/progress
