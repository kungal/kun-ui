<script setup lang="ts">
import Basic from '~/examples/badge/Basic.vue'
import BasicSrc from '~/examples/badge/Basic.vue?raw'
import Dot from '~/examples/badge/Dot.vue'
import DotSrc from '~/examples/badge/Dot.vue?raw'
import Max from '~/examples/badge/Max.vue'
import MaxSrc from '~/examples/badge/Max.vue?raw'
import Colors from '~/examples/badge/Colors.vue'
import ColorsSrc from '~/examples/badge/Colors.vue?raw'
import Standalone from '~/examples/badge/Standalone.vue'
import StandaloneSrc from '~/examples/badge/Standalone.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">圆点</h2>
    <Demo title="Dot.vue" :source="DotSrc"><Dot /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">上限</h2>
    <Demo title="Max.vue" :source="MaxSrc"><Max /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">独立</h2>
    <Demo title="Standalone.vue" :source="StandaloneSrc"><Standalone /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunBadge.props" />

    <EventsTable :rows="meta.KunBadge.events" />
    <SlotsTable :rows="meta.KunBadge.slots" />
  </article>
</template>
