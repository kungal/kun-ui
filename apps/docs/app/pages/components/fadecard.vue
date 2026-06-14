<script setup lang="ts">
import Basic from '~/examples/fadecard/Basic.vue'
import BasicSrc from '~/examples/fadecard/Basic.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <p class="text-default-500 mt-6 text-sm">
      无属性 —— 把带 <code class="text-primary">v-if</code> 的内容放进默认插槽即可，切换时自动播放淡入淡出 + 高度展开过渡。
    </p>
  </article>
</template>
