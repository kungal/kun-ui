<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <!-- title + description 通过属性传入 -->
    <KunInfo
      color="info"
      icon="lucide:info"
      title="发布说明"
      description="本次更新修复了若干已知问题并提升了性能。"
    />

    <!-- 默认插槽承载更丰富的描述内容 -->
    <KunInfo color="success" icon="lucide:circle-check" title="上传完成">
      文件已成功上传，你可以在
      <a class="underline" href="#">资源列表</a>
      中查看。
    </KunInfo>

    <!-- title 具名插槽自定义标题 -->
    <KunInfo color="warning" icon="lucide:triangle-alert">
      <template #title>
        <span class="font-semibold">存储空间不足</span>
      </template>
      剩余空间不足 10%，请及时清理。
    </KunInfo>
  </div>
</template>
