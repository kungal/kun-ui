<script setup lang="ts">
import Basic from '~/examples/steps/Basic.vue'
import BasicSrc from '~/examples/steps/Basic.vue?raw'
import Vertical from '~/examples/steps/Vertical.vue'
import VerticalSrc from '~/examples/steps/Vertical.vue?raw'
import Colors from '~/examples/steps/Colors.vue'
import ColorsSrc from '~/examples/steps/Colors.vue?raw'
import meta from '~/generated/component-meta.json'

const stepsProps = meta.KunSteps.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色与尺寸</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="stepsProps" />

    <EventsTable :rows="meta.KunSteps.events" />
    <SlotsTable :rows="meta.KunSteps.slots" />
  </article>
</template>
