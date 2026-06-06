<script setup lang="ts">
import Basic from '~/examples/favicon/Basic.vue'
import BasicSrc from '~/examples/favicon/Basic.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Favicon</h1>
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <p class="text-default-500 mt-6 text-sm">无属性 —— 通过 class 控制尺寸即可。</p>
  </article>
</template>
