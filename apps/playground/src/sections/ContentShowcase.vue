<script setup lang="ts">
// Offline data-URI images so the lightbox demo needs no network.
const swatch = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`
  )}`

const imgs = [
  swatch('#7c3aed', '#ec4899'),
  swatch('#0ea5e9', '#22c55e'),
  swatch('#f59e0b', '#ef4444'),
]

// Trusted HTML (a real consumer would sanitize before passing).
const html = `<p>Rendered via <strong>KunContent</strong>. Click the image to open the lightbox:</p><img src="${imgs[0]}" alt="inline" style="max-width:200px;border-radius:8px" /><p>Spoiler: <span class="kun-spoiler kun-spoiler-hidden">revealed on click</span></p>`
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Content · Lightbox · Text · Markdown</h2>

    <h3 class="text-base font-medium">Lightbox Gallery (click a thumbnail)</h3>
    <KunLightboxGallery>
      <div class="flex flex-wrap gap-2">
        <KunLightboxGalleryItem
          v-for="(src, i) in imgs"
          :key="i"
          :src="src"
          :alt="`Image ${i + 1}`"
        >
          <img :src="src" class="rounded-kun-md size-24 object-cover" alt="" />
        </KunLightboxGalleryItem>
      </div>
    </KunLightboxGallery>

    <h3 class="text-base font-medium">
      Content (trusted HTML + spoiler + inline-image lightbox)
    </h3>
    <KunContent :content="html" class-name="flex flex-col gap-2 max-w-lg" />

    <h3 class="text-base font-medium">Text (safe wrapping) &amp; Markdown</h3>
    <div class="flex max-w-sm items-center gap-3">
      <KunText
        content="https://example.com/very/long_path/with_underscores_that_should_wrap"
        class-name="text-sm"
      />
      <KunMarkdown class="text-primary size-5" />
    </div>
  </section>
</template>
