<script setup lang="ts">
import Basic from '~/examples/taginput/Basic.vue'
import BasicSrc from '~/examples/taginput/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">TagInput</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunTagInput&gt;</code> — tag entry
      (<code class="text-primary">v-model</code> string[]) with split characters,
      validation, max-tags and a counter.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunTagInput.props" />
  </article>
</template>
