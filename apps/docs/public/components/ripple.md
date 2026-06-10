# Ripple (水波纹)

> 水波纹渲染组件,由 useRipple 组合式驱动。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// useRipple is auto-imported by the Nuxt layer.
const { ripples, onClick } = useRipple()
</script>

<template>
  <button
    class="bg-primary rounded-kun-lg relative overflow-hidden px-6 py-3 font-medium text-white"
    @click="onClick"
  >
    Click anywhere on me
    <KunRipple :ripples="ripples" />
  </button>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ripples` * | `RippleType[]` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/ripple
