<template>
  <KunScrollShadow
    axis="vertical"
    class-name="h-48 max-w-md"
    aria-label="可滚动的卡片列表"
  >
    <KunCard v-for="n in 10" :key="n" color="default" class-name="shrink-0">
      第 {{ n }} 行内容
    </KunCard>
  </KunScrollShadow>
</template>
