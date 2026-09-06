<template>
  <KunButtonGroup orientation="vertical" aria-label="图片工具">
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:zoom-in" /></template>
      放大
    </KunButton>
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:zoom-out" /></template>
      缩小
    </KunButton>
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:rotate-cw" /></template>
      旋转
    </KunButton>
  </KunButtonGroup>
</template>
