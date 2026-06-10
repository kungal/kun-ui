# Loading (加载)

> 加载态:覆盖内容的遮罩或独立加载器;内置图片。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="loading = !loading">
      Toggle overlay
    </KunButton>
    <KunLoading :loading="loading">
      <KunCard class-name="flex h-32 items-center justify-center">
        <span>Content behind the loading overlay</span>
      </KunCard>
    </KunLoading>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `description` | `string` | `"正在摸鱼中...咕咕咕"` |
| `loading` | `boolean` | `false` |
| `src` | `string` | `KUN_LOADING_IMAGE` |

---
本页来源 · KunUI · https://ui.kungal.com/components/loading
