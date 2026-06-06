<script setup lang="ts">
import Basic from '~/examples/imagenative/Basic.vue'
import BasicSrc from '~/examples/imagenative/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">ImageNative</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunImageNative&gt;</code> — a bare
      <code class="text-primary">&lt;img&gt;</code> with class merging, for cases that
      don't need KunImage's skeleton / optimization pipeline.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunImageNative.props" />
  </article>
</template>
