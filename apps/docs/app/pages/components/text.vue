<script setup lang="ts">
import Basic from '~/examples/text/Basic.vue'
import BasicSrc from '~/examples/text/Basic.vue?raw'
import Wrapping from '~/examples/text/Wrapping.vue'
import WrappingSrc from '~/examples/text/Wrapping.vue?raw'
import Styling from '~/examples/text/Styling.vue'
import StylingSrc from '~/examples/text/Styling.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">安全换行</h2>
    <Demo title="Wrapping.vue" :source="WrappingSrc"><Wrapping /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">样式与换行保留</h2>
    <Demo title="Styling.vue" :source="StylingSrc"><Styling /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunText.props" />

    <EventsTable :rows="meta.KunText.events" />
    <SlotsTable :rows="meta.KunText.slots" />
  </article>
</template>
