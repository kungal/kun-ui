<script setup lang="ts">
import Basic from '~/examples/input/Basic.vue'
import BasicSrc from '~/examples/input/Basic.vue?raw'
import States from '~/examples/input/States.vue'
import StatesSrc from '~/examples/input/States.vue?raw'
import Sizes from '~/examples/input/Sizes.vue'
import SizesSrc from '~/examples/input/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误与禁用</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunInput.props" />
  </article>
</template>
