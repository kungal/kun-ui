# Switch (开关)

> 布尔开关(v-model),可带标签。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="on" label="Notifications" />
    <KunSwitch v-model="off" label="Disabled" disabled />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `boolean` | — |
| `className` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `label` | `string` | `""` |
| `labelClassName` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/switch
