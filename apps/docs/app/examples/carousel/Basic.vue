<script setup lang="ts">
const slides = [
  { from: 'from-primary', to: 'to-secondary', label: 'CG 1' },
  { from: 'from-success', to: 'to-info', label: 'CG 2' },
  { from: 'from-warning', to: 'to-danger', label: 'CG 3' },
  { from: 'from-secondary', to: 'to-primary', label: 'CG 4' },
]
</script>

<template>
  <KunCarousel class-name="w-full max-w-md">
    <KunCarouselItem v-for="s in slides" :key="s.label">
      <div
        :class="`flex h-48 items-center justify-center rounded-kun-lg bg-gradient-to-br ${s.from} ${s.to} text-2xl font-bold text-white`"
      >
        {{ s.label }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
