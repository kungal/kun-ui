<script setup lang="ts">
import Basic from '~/examples/skeleton/Basic.vue'
import BasicSrc from '~/examples/skeleton/Basic.vue?raw'
import Shapes from '~/examples/skeleton/Shapes.vue'
import ShapesSrc from '~/examples/skeleton/Shapes.vue?raw'
import Loaded from '~/examples/skeleton/Loaded.vue'
import LoadedSrc from '~/examples/skeleton/Loaded.vue?raw'
import meta from '~/generated/component-meta.json'

const skeletonProps = meta.KunSkeleton.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">形状</h2>
    <Demo title="Shapes.vue" :source="ShapesSrc"><Shapes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">加载完成切换</h2>
    <Demo title="Loaded.vue" :source="LoadedSrc"><Loaded /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="skeletonProps" />

    <EventsTable :rows="meta.KunSkeleton.events" />
    <SlotsTable :rows="meta.KunSkeleton.slots" />
  </article>
</template>
