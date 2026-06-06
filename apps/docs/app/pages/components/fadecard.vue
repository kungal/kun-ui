<script setup lang="ts">
import Basic from '~/examples/fadecard/Basic.vue'
import BasicSrc from '~/examples/fadecard/Basic.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">FadeCard</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunFadeCard&gt;</code> — a transition wrapper that
      fades and expands its (conditional) default slot in and out.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <p class="text-default-500 mt-6 text-sm">
      No props — put your <code class="text-primary">v-if</code> content in the
      default slot.
    </p>
  </article>
</template>
