<script setup lang="ts">
import Basic from '~/examples/lightbox/Basic.vue'
import BasicSrc from '~/examples/lightbox/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Lightbox</h1>
    <p class="text-default-600 mt-3 text-lg">
      Image lightbox. The easy path: wrap thumbnails in
      <code class="text-primary">&lt;KunLightboxGallery&gt;</code> and make each a
      <code class="text-primary">&lt;KunLightboxGalleryItem&gt;</code> — clicking one
      opens the shared viewer. <code class="text-primary">&lt;KunLightbox&gt;</code> is
      also usable standalone (<code class="text-primary">v-model:is-open</code> +
      <code class="text-primary">images</code>).
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Gallery (click a thumbnail)</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">KunLightboxGalleryItem props</h2>
    <PropsTable :rows="meta.KunLightboxGalleryItem.props" />

    <h2 class="mt-8 mb-1 text-xl font-semibold">KunLightbox props (standalone)</h2>
    <PropsTable :rows="meta.KunLightbox.props" />

    <p class="text-default-500 mt-6 text-sm">
      <code class="text-primary">KunLightboxGallery</code> takes no props — it just
      wraps the items.
    </p>
  </article>
</template>
