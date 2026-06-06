<script setup lang="ts">
import Basic from '~/examples/badge/Basic.vue'
import BasicSrc from '~/examples/badge/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Badge</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunBadge&gt;</code> — a count or dot badge that
      wraps a trigger (button, icon…). <code class="text-primary">max</code> caps
      the displayed count.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Count &amp; dot</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunBadge.props" />
  </article>
</template>
