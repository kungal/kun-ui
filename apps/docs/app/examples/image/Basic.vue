<template>
  <!-- provider="none" → plain optimized-less <img> (the Nuxt layer also wires
       @nuxt/image, so you can pass provider/format/quality/etc. when needed). -->
  <KunImage
    src="/favicon.webp"
    alt="KunUI"
    provider="none"
    class-name="size-24 rounded-2xl"
  />
</template>
