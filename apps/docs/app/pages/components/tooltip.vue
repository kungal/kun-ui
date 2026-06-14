<script setup lang="ts">
import Basic from '~/examples/tooltip/Basic.vue'
import BasicSrc from '~/examples/tooltip/Basic.vue?raw'
import Placements from '~/examples/tooltip/Placements.vue'
import PlacementsSrc from '~/examples/tooltip/Placements.vue?raw'
import Arrow from '~/examples/tooltip/Arrow.vue'
import ArrowSrc from '~/examples/tooltip/Arrow.vue?raw'
import LongContent from '~/examples/tooltip/LongContent.vue'
import LongContentSrc from '~/examples/tooltip/LongContent.vue?raw'
import RichContent from '~/examples/tooltip/RichContent.vue'
import RichContentSrc from '~/examples/tooltip/RichContent.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">长内容</h2>
    <Demo title="LongContent.vue" :source="LongContentSrc"><LongContent /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">富内容</h2>
    <Demo title="RichContent.vue" :source="RichContentSrc"><RichContent /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunTooltip.props" />
  </article>
</template>
