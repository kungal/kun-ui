<script setup lang="ts">
import Basic from '~/examples/favicon/Basic.vue'
import BasicSrc from '~/examples/favicon/Basic.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Favicon</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunFavicon&gt;</code> — the KunUI mascot logo as an
      inline SVG. Size it with a <code class="text-primary">size-*</code> class.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <p class="text-default-500 mt-6 text-sm">No props — pass a class to size it.</p>
  </article>
</template>
