<script setup lang="ts">
const items = Array.from({ length: 8 }, (_, i) => i + 1)
</script>

<template>
  <KunCarousel :slides-per-view="3" gap="0.75rem" class-name="w-full max-w-lg">
    <KunCarouselItem v-for="n in items" :key="n">
      <div class="rounded-kun-lg bg-content2 flex h-28 items-center justify-center text-lg font-semibold">
        {{ n }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
