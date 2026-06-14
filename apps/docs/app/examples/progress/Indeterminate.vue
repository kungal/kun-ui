<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <!-- 进度未知时，使用不定态：进度条来回滑动 -->
    <KunProgress indeterminate color="primary" aria-label="加载中" />
    <KunProgress indeterminate variant="circle" color="secondary" aria-label="加载中" />
  </div>
</template>
