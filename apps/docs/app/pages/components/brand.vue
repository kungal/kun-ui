<script setup lang="ts">
import Basic from '~/examples/brand/Basic.vue'
import BasicSrc from '~/examples/brand/Basic.vue?raw'
import Badge from '~/examples/brand/Badge.vue'
import BadgeSrc from '~/examples/brand/Badge.vue?raw'
import Custom from '~/examples/brand/Custom.vue'
import CustomSrc from '~/examples/brand/Custom.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">徽标</h2>
    <Demo title="Badge.vue" :source="BadgeSrc"><Badge /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义样式</h2>
    <Demo title="Custom.vue" :source="CustomSrc"><Custom /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunBrand.props" />

    <EventsTable :rows="meta.KunBrand.events" />
    <SlotsTable :rows="meta.KunBrand.slots" />
  </article>
</template>
