<script setup lang="ts">
import Basic from '~/examples/slider/Basic.vue'
import BasicSrc from '~/examples/slider/Basic.vue?raw'
import Colors from '~/examples/slider/Colors.vue'
import ColorsSrc from '~/examples/slider/Colors.vue?raw'
import Sizes from '~/examples/slider/Sizes.vue'
import SizesSrc from '~/examples/slider/Sizes.vue?raw'
import Marks from '~/examples/slider/Marks.vue'
import MarksSrc from '~/examples/slider/Marks.vue?raw'
import Tooltip from '~/examples/slider/Tooltip.vue'
import TooltipSrc from '~/examples/slider/Tooltip.vue?raw'
import Step from '~/examples/slider/Step.vue'
import StepSrc from '~/examples/slider/Step.vue?raw'
import States from '~/examples/slider/States.vue'
import StatesSrc from '~/examples/slider/States.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">刻度</h2>
    <Demo title="Marks.vue" :source="MarksSrc"><Marks /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">提示气泡与数值</h2>
    <Demo title="Tooltip.vue" :source="TooltipSrc"><Tooltip /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">步长</h2>
    <Demo title="Step.vue" :source="StepSrc"><Step /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">状态</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunSlider.props" />
  </article>
</template>
