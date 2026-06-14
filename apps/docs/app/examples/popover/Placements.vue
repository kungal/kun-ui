<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunPopover position="top">
      <template #trigger>
        <KunButton variant="bordered">上 top</KunButton>
      </template>
      <div class="p-3 text-sm">出现在上方</div>
    </KunPopover>
    <KunPopover position="right">
      <template #trigger>
        <KunButton variant="bordered">右 right</KunButton>
      </template>
      <div class="p-3 text-sm">出现在右侧</div>
    </KunPopover>
    <KunPopover position="bottom">
      <template #trigger>
        <KunButton variant="bordered">下 bottom</KunButton>
      </template>
      <div class="p-3 text-sm">出现在下方</div>
    </KunPopover>
    <KunPopover position="left">
      <template #trigger>
        <KunButton variant="bordered">左 left</KunButton>
      </template>
      <div class="p-3 text-sm">出现在左侧</div>
    </KunPopover>
  </div>
</template>
