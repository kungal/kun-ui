<template>
  <KunPopover position="bottom" :show-arrow="true">
    <template #trigger>
      <KunButton variant="bordered">点击查看箭头</KunButton>
    </template>
    <div class="p-3 text-sm">
      <p class="font-medium">带箭头的弹出框</p>
      <p class="text-default-600 mt-1">箭头指向触发器。</p>
    </div>
  </KunPopover>
</template>
