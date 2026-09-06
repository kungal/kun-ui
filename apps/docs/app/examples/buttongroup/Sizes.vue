<script setup lang="ts">
import type { KunUISize } from '@kungal/ui-core'

const sizes: KunUISize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButtonGroup v-for="size in sizes" :key="size" :aria-label="`视图模式 ${size}`">
      <KunButton :size="size" variant="bordered" color="default">列表</KunButton>
      <KunButton :size="size" variant="bordered" color="default">网格</KunButton>
      <KunButton :size="size" variant="bordered" color="default">时间线</KunButton>
    </KunButtonGroup>
  </div>
</template>
