<script setup lang="ts">
import Basic from '~/examples/fileinput/Basic.vue'
import BasicSrc from '~/examples/fileinput/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">FileInput</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunFileInput&gt;</code> — a styled file picker
      button (<code class="text-primary">v-model</code> File | File[]); the trigger
      is fully customisable (its default icon is bundled).
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunFileInput.props" />
  </article>
</template>
