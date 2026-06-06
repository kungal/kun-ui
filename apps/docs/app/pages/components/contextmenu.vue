<script setup lang="ts">
import Basic from '~/examples/contextmenu/Basic.vue'
import BasicSrc from '~/examples/contextmenu/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">ContextMenu</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunContextMenu&gt;</code> — a positioned menu you
      open at a point (e.g. on right-click). Controlled via
      <code class="text-primary">visible</code> + <code class="text-primary">position</code>;
      emits <code class="text-primary">select</code> and <code class="text-primary">close</code>.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunContextMenu.props" />
  </article>
</template>
