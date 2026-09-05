<script setup lang="ts">
import Basic from '~/examples/timeline/Basic.vue'
import BasicSrc from '~/examples/timeline/Basic.vue?raw'
import Icons from '~/examples/timeline/Icons.vue'
import IconsSrc from '~/examples/timeline/Icons.vue?raw'
import meta from '~/generated/component-meta.json'

const itemProps = meta.KunTimelineItem.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">图标徽章</h2>
    <Demo title="Icons.vue" :source="IconsSrc"><Icons /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">KunTimelineItem 属性</h2>
    <PropsTable :rows="itemProps" />

    <EventsTable :rows="meta.KunTimelineItem.events" />
    <SlotsTable :rows="meta.KunTimelineItem.slots" />
  </article>
</template>
