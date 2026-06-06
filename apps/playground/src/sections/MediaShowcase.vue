<script setup lang="ts">
// Offline data-URI image so the demo renders with no network.
const demoImg = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Image, Link &amp; Divider</h2>

    <h3 class="text-base font-medium">
      Image (skeleton + aspect-ratio + object-fit)
    </h3>
    <div class="flex flex-wrap items-start gap-4">
      <KunImage
        :src="demoImg"
        alt="demo"
        aspect-ratio="4 / 3"
        class-name="w-48 rounded-kun-lg"
      />
      <KunImageNative
        :src="demoImg"
        alt="native"
        :width="120"
        class-name="rounded-kun-md"
      />
    </div>

    <h3 class="mt-2 text-base font-medium">Link</h3>
    <div class="flex flex-wrap items-center gap-4">
      <KunLink to="https://example.com" target="_blank" :is-show-anchor-icon="true">
        External link
      </KunLink>
      <KunLink to="/docs" color="secondary" underline="hover">
        Hover underline
      </KunLink>
      <KunLink to="#" color="success" underline="none">No underline</KunLink>
    </div>

    <h3 class="mt-2 text-base font-medium">Divider</h3>
    <KunDivider />
    <KunDivider>OR</KunDivider>
    <KunDivider border-style="dashed" color="primary" />
    <div class="flex h-10 items-center gap-3">
      <span class="text-sm">left</span>
      <KunDivider orientation="vertical" />
      <span class="text-sm">right</span>
    </div>
  </section>
</template>
