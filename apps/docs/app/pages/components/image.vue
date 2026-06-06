<script setup lang="ts">
import Basic from '~/examples/image/Basic.vue'
import BasicSrc from '~/examples/image/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Image</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunImage&gt;</code> — an image with skeleton,
      aspect-ratio and object-fit handling. Under the Nuxt layer it renders through
      <code class="text-primary">@nuxt/image</code> (NuxtImg); in plain Vue it's a
      native <code class="text-primary">&lt;img&gt;</code>.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunImage.props" />
  </article>
</template>
