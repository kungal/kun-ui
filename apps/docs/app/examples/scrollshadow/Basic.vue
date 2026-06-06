<template>
  <KunScrollShadow class-name="max-w-md">
    <KunCard v-for="n in 12" :key="n" color="default" class-name="w-32 shrink-0">
      Item {{ n }}
    </KunCard>
  </KunScrollShadow>
</template>
