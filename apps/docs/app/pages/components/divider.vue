<script setup lang="ts">
import Basic from '~/examples/divider/Basic.vue'
import BasicSrc from '~/examples/divider/Basic.vue?raw'
import WithLabel from '~/examples/divider/WithLabel.vue'
import WithLabelSrc from '~/examples/divider/WithLabel.vue?raw'
import Vertical from '~/examples/divider/Vertical.vue'
import VerticalSrc from '~/examples/divider/Vertical.vue?raw'
import Dashed from '~/examples/divider/Dashed.vue'
import DashedSrc from '~/examples/divider/Dashed.vue?raw'
import Colors from '~/examples/divider/Colors.vue'
import ColorsSrc from '~/examples/divider/Colors.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带标签</h2>
    <Demo title="WithLabel.vue" :source="WithLabelSrc"><WithLabel /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">虚线</h2>
    <Demo title="Dashed.vue" :source="DashedSrc"><Dashed /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunDivider.props" />
  </article>
</template>
