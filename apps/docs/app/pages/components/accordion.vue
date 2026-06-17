<script setup lang="ts">
import Basic from '~/examples/accordion/Basic.vue'
import BasicSrc from '~/examples/accordion/Basic.vue?raw'
import Multiple from '~/examples/accordion/Multiple.vue'
import MultipleSrc from '~/examples/accordion/Multiple.vue?raw'
import Variants from '~/examples/accordion/Variants.vue'
import VariantsSrc from '~/examples/accordion/Variants.vue?raw'
import meta from '~/generated/component-meta.json'

const accordionProps = meta.KunAccordion.props
const itemProps = meta.KunAccordionItem.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">多开 (multiple + v-model)</h2>
    <Demo title="Multiple.vue" :source="MultipleSrc"><Multiple /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">KunAccordion 属性</h2>
    <PropsTable :rows="accordionProps" />

    <h2 class="mt-8 mb-1 text-xl font-semibold">KunAccordionItem 属性</h2>
    <PropsTable :rows="itemProps" />
  </article>
</template>
