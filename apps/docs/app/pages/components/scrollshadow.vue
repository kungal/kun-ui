<script setup lang="ts">
import Basic from '~/examples/scrollshadow/Basic.vue'
import BasicSrc from '~/examples/scrollshadow/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">ScrollShadow</h1>
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">横向</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunScrollShadow.props" />
  </article>
</template>
