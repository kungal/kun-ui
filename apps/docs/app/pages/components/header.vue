<script setup lang="ts">
import Basic from '~/examples/header/Basic.vue'
import BasicSrc from '~/examples/header/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Header</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunHeader&gt;</code> — a styled section heading
      (<code class="text-primary">h1</code>–<code class="text-primary">h3</code>)
      with an optional description.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Scales</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunHeader.props" />
  </article>
</template>
