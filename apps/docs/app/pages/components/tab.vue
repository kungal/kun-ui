<script setup lang="ts">
import Basic from '~/examples/tab/Basic.vue'
import BasicSrc from '~/examples/tab/Basic.vue?raw'
import Variants from '~/examples/tab/Variants.vue'
import VariantsSrc from '~/examples/tab/Variants.vue?raw'
import Colors from '~/examples/tab/Colors.vue'
import ColorsSrc from '~/examples/tab/Colors.vue?raw'
import Sizes from '~/examples/tab/Sizes.vue'
import SizesSrc from '~/examples/tab/Sizes.vue?raw'
import Vertical from '~/examples/tab/Vertical.vue'
import VerticalSrc from '~/examples/tab/Vertical.vue?raw'
import Icons from '~/examples/tab/Icons.vue'
import IconsSrc from '~/examples/tab/Icons.vue?raw'
import Align from '~/examples/tab/Align.vue'
import AlignSrc from '~/examples/tab/Align.vue?raw'
import Disabled from '~/examples/tab/Disabled.vue'
import DisabledSrc from '~/examples/tab/Disabled.vue?raw'
import Panels from '~/examples/tab/Panels.vue'
import PanelsSrc from '~/examples/tab/Panels.vue?raw'
import LazyLoading from '~/examples/tab/LazyLoading.vue'
import LazyLoadingSrc from '~/examples/tab/LazyLoading.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">垂直方向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">图标</h2>
    <Demo title="Icons.vue" :source="IconsSrc"><Icons /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">对齐</h2>
    <Demo title="Align.vue" :source="AlignSrc"><Align /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">内容面板</h2>
    <Demo title="Panels.vue" :source="PanelsSrc"><Panels /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">懒加载 / 加载中</h2>
    <Demo title="LazyLoading.vue" :source="LazyLoadingSrc"><LazyLoading /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunTab.props" />
  </article>
</template>
