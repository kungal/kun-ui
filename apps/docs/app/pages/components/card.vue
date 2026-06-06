<script setup lang="ts">
import Basic from '~/examples/card/Basic.vue'
import BasicSrc from '~/examples/card/Basic.vue?raw'
import Colors from '~/examples/card/Colors.vue'
import ColorsSrc from '~/examples/card/Colors.vue?raw'
import Hoverable from '~/examples/card/Hoverable.vue'
import HoverableSrc from '~/examples/card/Hoverable.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Card</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunCard&gt;</code> — a container with color,
      border and hover options; becomes a link with <code class="text-primary">href</code>.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Colors</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Hoverable &amp; clickable</h2>
    <Demo title="Hoverable.vue" :source="HoverableSrc"><Hoverable /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunCard.props" />
  </article>
</template>
