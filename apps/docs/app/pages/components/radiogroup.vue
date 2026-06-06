<script setup lang="ts">
import Basic from '~/examples/radiogroup/Basic.vue'
import BasicSrc from '~/examples/radiogroup/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">RadioGroup</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunRadioGroup&gt;</code> — a single-choice group
      (<code class="text-primary">v-model</code> + <code class="text-primary">options</code>)
      with classic / card variants and orientation.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunRadioGroup.props" />
  </article>
</template>
