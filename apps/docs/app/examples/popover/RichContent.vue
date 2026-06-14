<template>
  <KunPopover position="bottom-start" :show-arrow="true">
    <template #trigger>
      <KunButton color="primary">打开卡片</KunButton>
    </template>
    <div class="flex w-64 flex-col gap-3 p-4">
      <div class="flex items-center gap-3">
        <div
          class="bg-primary flex size-10 items-center justify-center rounded-full font-semibold text-white"
        >
          K
        </div>
        <div>
          <p class="font-semibold">KunUI</p>
          <p class="text-default-600 text-sm">@kungalgame</p>
        </div>
      </div>
      <p class="text-default-600 text-sm">
        打开时焦点会移入面板，关闭时会返回到触发器。
      </p>
      <div class="flex justify-end gap-2">
        <KunButton size="sm" variant="bordered">取消</KunButton>
        <KunButton size="sm" color="primary">关注</KunButton>
      </div>
    </div>
  </KunPopover>
</template>
