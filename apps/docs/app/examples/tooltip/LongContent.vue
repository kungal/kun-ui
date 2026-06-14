<template>
  <KunTooltip
    text="这是一段很长的提示文字，当内容超过最大宽度 max-w-xs 时，文本会自动换行，而不会撑破容器或溢出屏幕。"
    position="top"
    :show-arrow="true"
  >
    <KunButton variant="bordered">悬停查看长内容</KunButton>
  </KunTooltip>
</template>
