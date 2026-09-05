<script setup lang="ts">
import Basic from '~/examples/textarea/Basic.vue'
import BasicSrc from '~/examples/textarea/Basic.vue?raw'
import AutoGrow from '~/examples/textarea/AutoGrow.vue'
import AutoGrowSrc from '~/examples/textarea/AutoGrow.vue?raw'
import States from '~/examples/textarea/States.vue'
import StatesSrc from '~/examples/textarea/States.vue?raw'
import Colors from '~/examples/textarea/Colors.vue'
import ColorsSrc from '~/examples/textarea/Colors.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自动增高与字数</h2>
    <Demo title="AutoGrow.vue" :source="AutoGrowSrc"><AutoGrow /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">状态与尺寸</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunTextarea.props" />

    <EventsTable :rows="meta.KunTextarea.events" />
    <SlotsTable :rows="meta.KunTextarea.slots" />
  </article>
</template>
