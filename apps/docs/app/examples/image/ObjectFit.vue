<script setup lang="ts">
// A wide image placed into a square box so the difference between
// cover (裁剪填满) and contain (完整缩放) is visible.
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs><rect width="600" height="200" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="cover"
        provider="none"
        object-fit="cover"
        aspect-ratio="1 / 1"
        class-name="w-40 rounded-kun-lg bg-default-100"
      />
      <span class="text-default-500 text-sm">cover</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="contain"
        provider="none"
        object-fit="contain"
        aspect-ratio="1 / 1"
        class-name="w-40 rounded-kun-lg bg-default-100"
      />
      <span class="text-default-500 text-sm">contain</span>
    </div>
  </div>
</template>
