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
import Overflow from '~/examples/tab/Overflow.vue'
import OverflowSrc from '~/examples/tab/Overflow.vue?raw'
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
import Badge from '~/examples/tab/Badge.vue'
import BadgeSrc from '~/examples/tab/Badge.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">溢出 · 自动滚动</h2>
    <p class="text-default-600 mb-3 text-sm leading-relaxed">
      横向 Tab 一旦放不下,会在容器内<strong>自动滚动</strong>而不是撑开页面——无需
      <code>scrollable</code> 开关,也无需手动判断是否溢出。溢出的一侧用遮罩把标签
      <strong>渐隐为透明</strong>(与背景色无关,任何底色都清晰),并在可滚动的一侧浮出
      箭头;选中的标签会自动滚入可见区,方向键切换时始终可见。传
      <code>:scroll-buttons="false"</code> 可只保留渐隐、去掉箭头。
    </p>
    <Demo title="Overflow.vue" :source="OverflowSrc"><Overflow /></Demo>

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

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义标签 · 徽标 / 圆点（#tab 插槽）</h2>
    <Demo title="Badge.vue" :source="BadgeSrc"><Badge /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunTab.props" />

    <EventsTable :rows="meta.KunTab.events" />
    <SlotsTable :rows="meta.KunTab.slots" />
  </article>
</template>
