<script setup lang="ts">
// 点击卡片任意位置即可「打碎」它——碎裂从点击点向外炸开、在重力下飞散坠落,
// 1.6s 后自动复原。整个飞散只跑 transform / opacity。
</script>

<template>
  <KunShatter trigger="click" :auto-restore="1600" keep-space class="cursor-pointer">
    <div
      class="border-default-200 bg-content1 rounded-kun-lg flex w-64 items-center gap-3 border p-4 shadow-sm select-none"
    >
      <div class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full text-2xl">
        🌸
      </div>
      <div>
        <p class="text-default-900 font-semibold">点击打碎我</p>
        <p class="text-default-500 text-xs">从点击点炸开 · 自动复原</p>
      </div>
    </div>
  </KunShatter>
</template>
