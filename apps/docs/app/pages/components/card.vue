<script setup lang="ts">
import Basic from '~/examples/card/Basic.vue'
import BasicSrc from '~/examples/card/Basic.vue?raw'
import Colors from '~/examples/card/Colors.vue'
import ColorsSrc from '~/examples/card/Colors.vue?raw'
import Variants from '~/examples/card/Variants.vue'
import VariantsSrc from '~/examples/card/Variants.vue?raw'
import Padding from '~/examples/card/Padding.vue'
import PaddingSrc from '~/examples/card/Padding.vue?raw'
import Hoverable from '~/examples/card/Hoverable.vue'
import HoverableSrc from '~/examples/card/Hoverable.vue?raw'
import Clickable from '~/examples/card/Clickable.vue'
import ClickableSrc from '~/examples/card/Clickable.vue?raw'
import Link from '~/examples/card/Link.vue'
import LinkSrc from '~/examples/card/Link.vue?raw'
import Slots from '~/examples/card/Slots.vue'
import SlotsSrc from '~/examples/card/Slots.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">内边距</h2>
    <Demo title="Padding.vue" :source="PaddingSrc"><Padding /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可悬停</h2>
    <Demo title="Hoverable.vue" :source="HoverableSrc"><Hoverable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可点击与涟漪</h2>
    <Demo title="Clickable.vue" :source="ClickableSrc"><Clickable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">链接</h2>
    <Demo title="Link.vue" :source="LinkSrc"><Link /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">插槽</h2>
    <Demo title="Slots.vue" :source="SlotsSrc"><Slots /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCard.props" />
  </article>
</template>
