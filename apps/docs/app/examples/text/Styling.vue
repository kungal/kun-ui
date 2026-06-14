<script setup lang="ts">
// content 内的换行会被保留(white-space: pre-wrap),className 透传任意
// Tailwind 类来控制字号 / 字重 / 颜色等样式。
const text = '第一行\n第二行(换行被保留)'
</script>

<template>
  <KunText :content="text" class-name="text-lg font-semibold text-primary" />
</template>
