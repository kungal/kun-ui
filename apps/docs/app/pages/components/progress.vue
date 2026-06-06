<script setup lang="ts">
import Basic from '~/examples/progress/Basic.vue'
import BasicSrc from '~/examples/progress/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Progress</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunProgress&gt;</code> — a progress bar:
      solid / striped / gradient / circle variants, indeterminate, optional label.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Variants</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunProgress.props" />
  </article>
</template>
