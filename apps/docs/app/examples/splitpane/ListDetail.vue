<script setup lang="ts">
import { ref } from 'vue'

// `v-model:size` updates on every move of the divider; `resize-end` fires
// once per drag or key press — persist that one (a cookie the server reads
// back into `size`, so the SSR HTML already has the width).
const size = ref(360)
const saved = ref<number | null>(null)
const topics = [
  { id: 1, title: '《星空列车与白的旅行》通关感想', author: '鲲', replies: 42 },
  { id: 2, title: '求推荐和《白色相簿 2》气质相近的作品', author: '雪之下小春', replies: 128 },
  { id: 3, title: '2026 年秋季新作发售表（持续更新）', author: '坂上智代', replies: 67 },
  { id: 4, title: '汉化补丁 1.2 更新说明', author: '鲲', replies: 15 },
]
const current = ref(topics[0]!)
</script>

<template>
  <div class="w-full space-y-2">
    <div class="border-default-200 rounded-kun-lg h-80 w-full overflow-hidden border">
      <KunSplitPane v-model:size="size" :snap-points="[360, 412]" @resize-end="(s) => (saved = s)">
        <template #start>
          <ul class="bg-content1 h-full overflow-y-auto p-1.5">
            <li v-for="t in topics" :key="t.id">
              <button
                type="button"
                class="rounded-kun-md hover:bg-default/20 w-full px-3 py-2 text-left"
                :class="current.id === t.id && 'bg-primary/10'"
                @click="current = t"
              >
                <span class="block truncate text-sm font-medium">{{ t.title }}</span>
                <span class="text-foreground-muted text-xs">{{ t.author }} · {{ t.replies }} 回复</span>
              </button>
            </li>
          </ul>
        </template>
        <template #end>
          <article class="h-full overflow-y-auto p-5">
            <h3 class="text-lg font-semibold">{{ current.title }}</h3>
            <p class="text-foreground-muted mt-1 text-xs">{{ current.author }} · {{ current.replies }} 回复</p>
            <p class="text-default-700 mt-3 text-sm leading-6">
              拖动中间的分隔线调整左栏宽度，靠近 360 或 412 时会吸附过去，离开 8px 以上就能停在任意宽度。聚焦分隔线后可以用
              <KunKbd keys="ArrowLeft" /> <KunKbd keys="ArrowRight" /> 微调，按住 <KunKbd keys="Shift" /> 一次走五步，
              <KunKbd keys="Home" /> / <KunKbd keys="End" /> 直接到最窄 / 最宽。
            </p>
          </article>
        </template>
      </KunSplitPane>
    </div>
    <p class="text-foreground-muted text-xs">当前 {{ size }}px · 上次保存 {{ saved ?? '—' }}</p>
  </div>
</template>
