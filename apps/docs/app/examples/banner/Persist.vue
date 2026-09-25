<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <!-- 换一条公告就换一个 storage-key,关过旧公告的人会重新看到新的。 -->
    <KunBanner
      v-model="open"
      storage-key="docs-demo-2026-09"
      icon="lucide:info"
      text="关闭这条横幅后刷新页面,它不会再出现。"
    />
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">
        {{ open ? '横幅显示中。' : '已关闭,记录在 localStorage 里,刷新页面试试。' }}
      </p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
