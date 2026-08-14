# Loading (加载)

> 加载态:覆盖内容的遮罩或独立加载器;内置图片。

## 示例

### Basic.vue

```vue
<template>
  <!-- 无默认插槽时，KunLoading 作为独立的居中加载器渲染（内置吉祥物图片）。 -->
  <KunLoading description="正在摸鱼中...咕咕咕" />
</template>
```

### Overlay.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 有默认插槽时，KunLoading 作为遮罩层覆盖在内容之上，由 loading 控制显隐。
const loading = ref(true)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="loading = !loading">
      切换遮罩
    </KunButton>
    <KunLoading :loading="loading">
      <KunCard class-name="flex h-32 items-center justify-center">
        <span>被遮罩覆盖的内容</span>
      </KunCard>
    </KunLoading>
  </div>
</template>
```

### Spinner.vue

```vue
<template>
  <!-- spinner=true 用紧凑的旋转图标代替吉祥物图片；size 控制旋转图标尺寸。 -->
  <div class="flex flex-wrap items-end gap-10">
    <KunLoading spinner size="sm" description="加载中" />
    <KunLoading spinner size="md" description="加载中" />
    <KunLoading spinner size="lg" description="加载中" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `"正在摸鱼中...咕咕咕"` |  |
| `loading` | `boolean` | `false` |  |
| `size` | `KunUISize` | `"md"` |  |
| `spinner` | `boolean` | `false` |  |
| `src` | `string` | `KUN_LOADING_IMAGE` | Image shown while loading. Defaults to a bundled mascot (base64 data URI — no network request, no consumer asset needed). Pass any URL or data URI to override. |

---
本页来源 · KunUI · https://ui.kungal.com/components/loading
