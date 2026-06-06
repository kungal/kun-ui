<script setup lang="ts">
import Basic from '~/examples/markdown/Basic.vue'
import BasicSrc from '~/examples/markdown/Basic.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Markdown</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunMarkdown&gt;</code> — the KunUI markdown glyph
      (an inline SVG). Size it with a <code class="text-primary">size-*</code> /
      text-color class.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <p class="text-default-500 mt-6 text-sm">No props — pass a class to size/tint it.</p>
  </article>
</template>
