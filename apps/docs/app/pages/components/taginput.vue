<script setup lang="ts">
import Basic from '~/examples/taginput/Basic.vue'
import BasicSrc from '~/examples/taginput/Basic.vue?raw'
import Variants from '~/examples/taginput/Variants.vue'
import VariantsSrc from '~/examples/taginput/Variants.vue?raw'
import Limits from '~/examples/taginput/Limits.vue'
import LimitsSrc from '~/examples/taginput/Limits.vue?raw'
import States from '~/examples/taginput/States.vue'
import StatesSrc from '~/examples/taginput/States.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体与颜色</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">上限与分隔</h2>
    <Demo title="Limits.vue" :source="LimitsSrc"><Limits /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误与禁用</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunTagInput.props" />
  </article>
</template>
