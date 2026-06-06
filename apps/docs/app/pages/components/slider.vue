<script setup lang="ts">
import Basic from '~/examples/slider/Basic.vue'
import BasicSrc from '~/examples/slider/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Slider</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunSlider&gt;</code> — a range slider
      (<code class="text-primary">v-model</code> number) with min / max / step.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunSlider.props" />
  </article>
</template>
