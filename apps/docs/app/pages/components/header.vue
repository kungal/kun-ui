<script setup lang="ts">
import Basic from '~/examples/header/Basic.vue'
import BasicSrc from '~/examples/header/Basic.vue?raw'
import Scale from '~/examples/header/Scale.vue'
import ScaleSrc from '~/examples/header/Scale.vue?raw'
import WithDescription from '~/examples/header/WithDescription.vue'
import WithDescriptionSrc from '~/examples/header/WithDescription.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">层级</h2>
    <Demo title="Scale.vue" :source="ScaleSrc"><Scale /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带描述</h2>
    <Demo title="WithDescription.vue" :source="WithDescriptionSrc"><WithDescription /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunHeader.props" />
  </article>
</template>
