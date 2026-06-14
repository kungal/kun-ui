<template>
  <KunScrollShadow class-name="max-w-md" aria-label="标签列表">
    <KunChip v-for="n in 16" :key="n" color="primary" class-name="shrink-0">
      标签 {{ n }}
    </KunChip>
  </KunScrollShadow>
</template>
