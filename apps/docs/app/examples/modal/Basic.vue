<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open modal</KunButton>
  <KunModal
    v-model="open"
    title="Hello from a modal"
    description="Teleported to body, focus-trapped, body-scroll-locked. Press Esc or click the backdrop to close."
  >
    <p class="text-default-600 text-sm">
      <code>title</code> 渲染为面板的 <code>&lt;h2&gt;</code> 并关联
      <code>aria-labelledby</code>,<code>description</code> 关联
      <code>aria-describedby</code> — 屏幕阅读器念到的名字就是屏幕上看到的那个。
    </p>
  </KunModal>
</template>
