<script setup lang="ts">
import { ref } from 'vue'

// 碎片数(pieces)由 Voronoi 胞元决定,2–160 之间钳制。无论多少片,飞散动画都只在
// 合成器线程跑;一次性构建成本被裁到 ≈ 元素自身面积(每片只绘自己那一小块切片)。
const pieces = ref(28)
</script>

<template>
  <div class="flex w-72 flex-col gap-3">
    <label class="text-default-500 text-sm">碎片数:{{ pieces }}</label>
    <KunSlider v-model="pieces" :min="4" :max="120" :step="1" />

    <KunShatter
      trigger="click"
      :pieces="pieces"
      :auto-restore="1500"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-32 w-72 items-center justify-center border shadow-sm select-none"
      >
        <span class="text-default-700 font-semibold">点击打碎 · {{ pieces }} 片</span>
      </div>
    </KunShatter>
  </div>
</template>
