<script setup lang="ts">
import Basic from '~/examples/info/Basic.vue'
import BasicSrc from '~/examples/info/Basic.vue?raw'
import Colors from '~/examples/info/Colors.vue'
import ColorsSrc from '~/examples/info/Colors.vue?raw'
import Variants from '~/examples/info/Variants.vue'
import VariantsSrc from '~/examples/info/Variants.vue?raw'
import TitleDescription from '~/examples/info/TitleDescription.vue'
import TitleDescriptionSrc from '~/examples/info/TitleDescription.vue?raw'
import CustomIcon from '~/examples/info/CustomIcon.vue'
import CustomIconSrc from '~/examples/info/CustomIcon.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">标题与描述</h2>
    <Demo title="TitleDescription.vue" :source="TitleDescriptionSrc"><TitleDescription /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义图标</h2>
    <Demo title="CustomIcon.vue" :source="CustomIconSrc"><CustomIcon /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunInfo.props" />
  </article>
</template>
