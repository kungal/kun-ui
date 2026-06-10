# Slider (滑块)

> 范围滑块(v-model number),支持 min / max / step。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref(40)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider v-model="v" :min="0" :max="100" :step="1" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ v }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `number` | — |
| `max` | `number` | `77` |
| `min` | `number` | `17` |
| `step` | `number` | `1` |

---
本页来源 · KunUI · https://ui.kungal.com/components/slider
