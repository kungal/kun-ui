<script setup lang="ts">
import Basic from '~/examples/link/Basic.vue'
import BasicSrc from '~/examples/link/Basic.vue?raw'
import Colors from '~/examples/link/Colors.vue'
import ColorsSrc from '~/examples/link/Colors.vue?raw'
import External from '~/examples/link/External.vue'
import ExternalSrc from '~/examples/link/External.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">外部链接</h2>
    <Demo title="External.vue" :source="ExternalSrc"><External /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunLink.props" />
  </article>
</template>
