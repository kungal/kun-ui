<script setup lang="ts">
import Basic from '~/examples/numberinput/Basic.vue'
import BasicSrc from '~/examples/numberinput/Basic.vue?raw'
import Sizes from '~/examples/numberinput/Sizes.vue'
import SizesSrc from '~/examples/numberinput/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunNumberInput.props" />
  </article>
</template>
