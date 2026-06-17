<script setup lang="ts">
import { ref } from 'vue'
const loaded = ref(false)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-4">
    <KunButton size="sm" @click="loaded = !loaded">
      {{ loaded ? '重新加载' : '完成加载' }}
    </KunButton>
    <KunSkeleton :loaded="loaded" variant="rect" height="4rem">
      <KunCard class-name="w-full">
        <p class="font-medium">内容已就绪</p>
        <p class="text-default-500 text-sm">loaded 为 true 时渲染默认插槽。</p>
      </KunCard>
    </KunSkeleton>
  </div>
</template>
