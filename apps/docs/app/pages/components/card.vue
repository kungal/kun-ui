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
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可悬停与可点击</h2>
    <Demo title="Hoverable.vue" :source="HoverableSrc"><Hoverable /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCard.props" />
  </article>
</template>
