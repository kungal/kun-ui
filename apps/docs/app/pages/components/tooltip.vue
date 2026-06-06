<script setup lang="ts">
import Basic from '~/examples/tooltip/Basic.vue'
import BasicSrc from '~/examples/tooltip/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Tooltip</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunTooltip&gt;</code> — a hover / focus tooltip
      around a trigger, positionable on any side.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunTooltip.props" />
  </article>
</template>
