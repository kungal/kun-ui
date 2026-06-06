<script setup lang="ts">
import Basic from '~/examples/loading/Basic.vue'
import BasicSrc from '~/examples/loading/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Loading</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunLoading&gt;</code> — a loading state: an overlay
      over wrapped content (default slot) or a standalone loader. The default image
      is bundled (no network request).
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Overlay</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunLoading.props" />
  </article>
</template>
