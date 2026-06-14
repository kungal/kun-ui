<template>
  <KunCard color="default" class-name="max-w-sm">
    <!-- header 插槽 -->
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">卡片标题</span>
        <KunChip color="primary" size="xs">新</KunChip>
      </div>
    </template>

    <!-- cover 插槽 -->
    <template #cover>
      <div class="bg-primary-100 text-primary flex h-28 items-center justify-center rounded-kun-lg">
        <KunIcon name="lucide:layout-grid" class="text-3xl" />
      </div>
    </template>

    <!-- 默认插槽：正文 -->
    <p class="text-default-600 text-sm">
      header、cover、footer 与默认插槽可自由组合，构建结构化卡片。
    </p>

    <!-- footer 插槽 -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <KunButton size="sm" variant="light">取消</KunButton>
        <KunButton size="sm" color="primary">确定</KunButton>
      </div>
    </template>
  </KunCard>
</template>
