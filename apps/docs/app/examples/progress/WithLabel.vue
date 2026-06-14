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
