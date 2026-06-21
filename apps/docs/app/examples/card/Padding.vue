<template>
  <!-- padding 控制内边距:默认 lg(24px);sm(12px)更紧凑,none 用于满铺(如纯封面图)。 -->
  <KunCard padding="sm" class-name="w-40">
    <span class="font-medium">sm</span>
    <span class="text-default-500 text-sm">12px(紧凑)</span>
  </KunCard>

  <KunCard padding="md" class-name="w-40">
    <span class="font-medium">md</span>
    <span class="text-default-500 text-sm">20px</span>
  </KunCard>

  <KunCard padding="lg" class-name="w-40">
    <span class="font-medium">lg(默认)</span>
    <span class="text-default-500 text-sm">24px(舒适)</span>
  </KunCard>
</template>
