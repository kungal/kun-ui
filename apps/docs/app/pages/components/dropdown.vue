<script setup lang="ts">
import Basic from '~/examples/dropdown/Basic.vue'
import BasicSrc from '~/examples/dropdown/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Dropdown</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunDropdown&gt;</code> — a menu of
      <code class="text-primary">items</code> anchored to a
      <code class="text-primary">#trigger</code> slot.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunDropdown.props" />
  </article>
</template>
