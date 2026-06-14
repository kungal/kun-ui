<template>
  <!-- 图标以 currentColor 绘制,继承文字颜色。用 text-* 直接上色,
       或包裹在带 text-* 的元素里。 -->
  <div class="flex items-center gap-4 text-2xl">
    <KunIcon name="lucide:circle-check" class="text-primary" />
    <KunIcon name="lucide:circle-check" class="text-success" />
    <KunIcon name="lucide:triangle-alert" class="text-warning" />
    <KunIcon name="lucide:circle-x" class="text-danger" />
    <span class="text-secondary"><KunIcon name="lucide:info" /></span>
  </div>
</template>
