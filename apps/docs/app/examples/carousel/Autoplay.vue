<script setup lang="ts">
const slides = ['公告一', '公告二', '公告三']
</script>

<template>
  <KunCarousel :autoplay="2500" class-name="w-full max-w-md">
    <KunCarouselItem v-for="(s, i) in slides" :key="i">
      <div class="rounded-kun-lg bg-primary/10 text-primary flex h-32 items-center justify-center text-xl font-bold">
        {{ s }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
