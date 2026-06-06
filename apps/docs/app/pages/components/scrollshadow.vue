<script setup lang="ts">
import Basic from '~/examples/scrollshadow/Basic.vue'
import BasicSrc from '~/examples/scrollshadow/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">ScrollShadow</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunScrollShadow&gt;</code> — a scroll container
      with edge fade shadows that appear only where there's more content.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Horizontal</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunScrollShadow.props" />
  </article>
</template>
