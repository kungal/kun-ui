# Modal (对话框)

> 传送到 body 的对话框,焦点锁定、滚动锁定,可按 Esc 关闭。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open modal</KunButton>
  <KunModal v-model="open">
    <h3 class="text-lg font-semibold">Hello from a modal</h3>
    <p class="text-default-600 mt-1">
      Teleported to body, focus-trapped, body-scroll-locked. Press Esc or click
      the backdrop to close.
    </p>
  </KunModal>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `boolean` | — |
| `className` | `string` | `""` |
| `innerClassName` | `string` | `""` |
| `isDismissable` | `boolean` | `true` |
| `isShowCloseButton` | `boolean` | `true` |
| `rounded` | `KunUIRounded` | `undefined` |
| `withContainer` | `boolean` | `true` |

---
本页来源 · KunUI · https://ui.kungal.com/components/modal
