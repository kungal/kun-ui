<script setup lang="ts">
import Basic from '~/examples/upload/Basic.vue'
import BasicSrc from '~/examples/upload/Basic.vue?raw'
import SizeAspect from '~/examples/upload/SizeAspect.vue'
import SizeAspectSrc from '~/examples/upload/SizeAspect.vue?raw'
import Rounded from '~/examples/upload/Rounded.vue'
import RoundedSrc from '~/examples/upload/Rounded.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸与比例</h2>
    <Demo title="SizeAspect.vue" :source="SizeAspectSrc"><SizeAspect /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">圆角与默认图片</h2>
    <Demo title="Rounded.vue" :source="RoundedSrc"><Rounded /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunUpload.props" />
  </article>
</template>
