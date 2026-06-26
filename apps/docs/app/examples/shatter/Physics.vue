<script setup lang="ts">
// 用 gravity(重力)、spread(飞散距离)、rotation(自旋)组合出不同手感。
// 重力以 t² 加速度施加,所以「重力坠落」是真正的加速下坠,而非匀速平移。
const presets = [
  { name: '轻盈飘散', gravity: 0.35, spread: 1.2, rotation: 90 },
  { name: '重力坠落', gravity: 2.4, spread: 0.45, rotation: 80 },
  { name: '猛烈炸裂', gravity: 0.5, spread: 1.9, rotation: 240 },
]
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <KunShatter
      v-for="p in presets"
      :key="p.name"
      trigger="click"
      :gravity="p.gravity"
      :spread="p.spread"
      :rotation="p.rotation"
      :auto-restore="1600"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-28 w-36 items-center justify-center border shadow-sm select-none"
      >
        <span class="text-default-700 text-sm font-semibold">{{ p.name }}</span>
      </div>
    </KunShatter>
  </div>
</template>
