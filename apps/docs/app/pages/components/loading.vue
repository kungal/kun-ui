<script setup lang="ts">
import Basic from '~/examples/loading/Basic.vue'
import BasicSrc from '~/examples/loading/Basic.vue?raw'
import Overlay from '~/examples/loading/Overlay.vue'
import OverlaySrc from '~/examples/loading/Overlay.vue?raw'
import Spinner from '~/examples/loading/Spinner.vue'
import SpinnerSrc from '~/examples/loading/Spinner.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">遮罩覆盖</h2>
    <Demo title="Overlay.vue" :source="OverlaySrc"><Overlay /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">旋转图标与尺寸</h2>
    <Demo title="Spinner.vue" :source="SpinnerSrc"><Spinner /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunLoading.props" />
  </article>
</template>
