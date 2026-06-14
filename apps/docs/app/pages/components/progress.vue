<script setup lang="ts">
import Basic from '~/examples/progress/Basic.vue'
import BasicSrc from '~/examples/progress/Basic.vue?raw'
import Colors from '~/examples/progress/Colors.vue'
import ColorsSrc from '~/examples/progress/Colors.vue?raw'
import Variants from '~/examples/progress/Variants.vue'
import VariantsSrc from '~/examples/progress/Variants.vue?raw'
import Circle from '~/examples/progress/Circle.vue'
import CircleSrc from '~/examples/progress/Circle.vue?raw'
import Indeterminate from '~/examples/progress/Indeterminate.vue'
import IndeterminateSrc from '~/examples/progress/Indeterminate.vue?raw'
import WithLabel from '~/examples/progress/WithLabel.vue'
import WithLabelSrc from '~/examples/progress/WithLabel.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">条纹与渐变</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">圆环</h2>
    <Demo title="Circle.vue" :source="CircleSrc"><Circle /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不定态</h2>
    <Demo title="Indeterminate.vue" :source="IndeterminateSrc"><Indeterminate /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带标签</h2>
    <Demo title="WithLabel.vue" :source="WithLabelSrc"><WithLabel /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunProgress.props" />
  </article>
</template>
