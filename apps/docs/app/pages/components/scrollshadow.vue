<script setup lang="ts">
import Basic from '~/examples/scrollshadow/Basic.vue'
import BasicSrc from '~/examples/scrollshadow/Basic.vue?raw'
import Vertical from '~/examples/scrollshadow/Vertical.vue'
import VerticalSrc from '~/examples/scrollshadow/Vertical.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <p class="text-default-500 mt-6 text-sm">
      建议为可滚动区域设置 <code class="text-primary">aria-label</code>，以便屏幕阅读器识别该区域。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunScrollShadow.props" />
  </article>
</template>
