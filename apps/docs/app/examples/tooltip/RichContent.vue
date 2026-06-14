<template>
  <KunTooltip position="top" :show-arrow="true">
    <KunButton variant="bordered" color="secondary">富内容提示</KunButton>
    <template #content>
      <div class="flex items-center gap-2">
        <KunIcon name="lucide:info" class="text-primary" />
        <span>通过 content 插槽自定义提示内容</span>
      </div>
    </template>
  </KunTooltip>
</template>
