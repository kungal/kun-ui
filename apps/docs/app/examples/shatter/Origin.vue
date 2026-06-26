<script setup lang="ts">
// origin 决定碎裂从哪一点向外炸开:center(默认)、top、pointer(上次指针位置),
// 也可传 { x, y } 像素坐标。点击各卡片对比。
const origins = ['center', 'top', 'pointer'] as const
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <KunShatter
      v-for="o in origins"
      :key="o"
      trigger="click"
      :origin="o"
      :auto-restore="1500"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-28 w-36 flex-col items-center justify-center gap-1 border shadow-sm select-none"
      >
        <span class="text-default-400 text-xs">origin</span>
        <code class="text-primary text-sm font-semibold">{{ o }}</code>
      </div>
    </KunShatter>
  </div>
</template>
