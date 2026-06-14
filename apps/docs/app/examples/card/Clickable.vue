<script setup lang="ts">
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <!-- clickable：渲染为 <button>，带点击缩放与涟漪效果。 -->
  <KunCard clickable color="primary" class-name="max-w-sm" @click="clicks++">
    <h3 class="font-semibold">可点击卡片</h3>
    <p class="text-default-600 mt-1 text-sm">点击查看涟漪效果，已点击 {{ clicks }} 次。</p>
  </KunCard>
</template>
