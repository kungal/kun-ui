<script setup lang="ts">
import Basic from '~/examples/link/Basic.vue'
import BasicSrc from '~/examples/link/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Link</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunLink&gt;</code> — a styled link; renders through
      the injected link component (NuxtLink under the layer, native
      <code class="text-primary">&lt;a&gt;</code> in plain Vue).
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunLink.props" />
  </article>
</template>
