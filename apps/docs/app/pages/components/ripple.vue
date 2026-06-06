<script setup lang="ts">
import Basic from '~/examples/ripple/Basic.vue'
import BasicSrc from '~/examples/ripple/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Ripple</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunRipple&gt;</code> — the ripple-effect renderer.
      Drive it with the <code class="text-primary">useRipple()</code> composable on
      any <code class="text-primary">relative overflow-hidden</code> element.
      (KunButton already has ripple built in.)
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunRipple.props" />
  </article>
</template>
