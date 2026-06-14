<script setup lang="ts">
import Basic from '~/examples/popover/Basic.vue'
import BasicSrc from '~/examples/popover/Basic.vue?raw'
import Placements from '~/examples/popover/Placements.vue'
import PlacementsSrc from '~/examples/popover/Placements.vue?raw'
import Arrow from '~/examples/popover/Arrow.vue'
import ArrowSrc from '~/examples/popover/Arrow.vue?raw'
import RichContent from '~/examples/popover/RichContent.vue'
import RichContentSrc from '~/examples/popover/RichContent.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">位置</h2>
    <Demo title="Placements.vue" :source="PlacementsSrc"><Placements /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">箭头</h2>
    <Demo title="Arrow.vue" :source="ArrowSrc"><Arrow /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">富内容</h2>
    <Demo title="RichContent.vue" :source="RichContentSrc"><RichContent /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPopover.props" />
  </article>
</template>
