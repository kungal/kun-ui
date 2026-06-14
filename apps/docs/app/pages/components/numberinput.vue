<script setup lang="ts">
import Basic from '~/examples/numberinput/Basic.vue'
import BasicSrc from '~/examples/numberinput/Basic.vue?raw'
import Sizes from '~/examples/numberinput/Sizes.vue'
import SizesSrc from '~/examples/numberinput/Sizes.vue?raw'
import Precision from '~/examples/numberinput/Precision.vue'
import PrecisionSrc from '~/examples/numberinput/Precision.vue?raw'
import Range from '~/examples/numberinput/Range.vue'
import RangeSrc from '~/examples/numberinput/Range.vue?raw'
import Colors from '~/examples/numberinput/Colors.vue'
import ColorsSrc from '~/examples/numberinput/Colors.vue?raw'
import States from '~/examples/numberinput/States.vue'
import StatesSrc from '~/examples/numberinput/States.vue?raw'
import NoControls from '~/examples/numberinput/NoControls.vue'
import NoControlsSrc from '~/examples/numberinput/NoControls.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">精度与步长</h2>
    <Demo title="Precision.vue" :source="PrecisionSrc"><Precision /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">范围限制</h2>
    <Demo title="Range.vue" :source="RangeSrc"><Range /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">状态</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">无步进按钮</h2>
    <Demo title="NoControls.vue" :source="NoControlsSrc"><NoControls /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunNumberInput.props" />
  </article>
</template>
