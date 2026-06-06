<script setup lang="ts">
import Basic from '~/examples/info/Basic.vue'
import BasicSrc from '~/examples/info/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Info</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunInfo&gt;</code> — an inline callout box with
      color, icon, title and description; solid / flat / bordered variants.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Colors &amp; variants</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunInfo.props" />
  </article>
</template>
