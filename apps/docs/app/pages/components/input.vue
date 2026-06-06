<script setup lang="ts">
import Basic from '~/examples/input/Basic.vue'
import BasicSrc from '~/examples/input/Basic.vue?raw'
import States from '~/examples/input/States.vue'
import StatesSrc from '~/examples/input/States.vue?raw'
import Sizes from '~/examples/input/Sizes.vue'
import SizesSrc from '~/examples/input/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Input</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunInput&gt;</code> — text input with
      <code class="text-primary">v-model</code>, label, helper / error text, sizes.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Error &amp; disabled</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Sizes</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunInput.props" />
  </article>
</template>
