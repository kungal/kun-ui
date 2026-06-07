<script setup lang="ts">
import Basic from '~/examples/lightbox/Basic.vue'
import BasicSrc from '~/examples/lightbox/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">画廊(点击缩略图)</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">KunLightboxGalleryItem 属性</h2>
    <PropsTable :rows="meta.KunLightboxGalleryItem.props" />

    <h2 class="mt-8 mb-1 text-xl font-semibold">KunLightbox 属性(独立使用)</h2>
    <PropsTable :rows="meta.KunLightbox.props" />

    <p class="text-default-500 mt-6 text-sm">
      <code class="text-primary">KunLightboxGallery</code> 没有属性 —— 它只是包裹这些项。
    </p>
  </article>
</template>
