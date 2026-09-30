<script setup lang="ts">
import { ref } from 'vue'

// Stacking follows the component's OWN width (a container query), not the
// window: this box is narrower than 48rem, so it shows one pane at a time on
// any screen, and `show-pane` chooses which.
const pane = ref<'start' | 'end'>('start')
</script>

<template>
  <div class="w-full max-w-sm space-y-2">
    <div class="flex gap-2">
      <KunButton size="sm" :variant="pane === 'start' ? 'solid' : 'bordered'" @click="pane = 'start'">列表</KunButton>
      <KunButton size="sm" :variant="pane === 'end' ? 'solid' : 'bordered'" @click="pane = 'end'">详情</KunButton>
    </div>
    <div class="border-default-200 rounded-kun-lg h-48 overflow-hidden border">
      <KunSplitPane :show-pane="pane">
        <template #start>
          <ul class="bg-content1 h-full space-y-1 p-3 text-sm">
            <li>《星空列车与白的旅行》通关感想</li>
            <li>求推荐和《白色相簿 2》气质相近的作品</li>
            <li>2026 年秋季新作发售表</li>
          </ul>
        </template>
        <template #end>
          <p class="text-default-700 p-3 text-sm">窄于 48rem 时只显示一栏，分隔线也会隐藏。</p>
        </template>
      </KunSplitPane>
    </div>
  </div>
</template>
