<script setup lang="ts">
import Basic from '~/examples/modal/Basic.vue'
import BasicSrc from '~/examples/modal/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Modal</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunModal&gt;</code> — a dialog
      (<code class="text-primary">v-model</code> boolean) teleported to body,
      focus-trapped, body-scroll-locked, Escape to close.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunModal.props" />
  </article>
</template>
