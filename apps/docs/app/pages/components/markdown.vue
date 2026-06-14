<script setup lang="ts">
import Basic from '~/examples/markdown/Basic.vue'
import BasicSrc from '~/examples/markdown/Basic.vue?raw'
import Sizes from '~/examples/markdown/Sizes.vue'
import SizesSrc from '~/examples/markdown/Sizes.vue?raw'
import Colors from '~/examples/markdown/Colors.vue'
import ColorsSrc from '~/examples/markdown/Colors.vue?raw'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <p class="text-default-500 mt-6 text-sm">
      KunMarkdown 渲染 KunUI 的 Markdown 字形(内联 SVG),无属性 —— 通过 class
      控制尺寸 / 颜色即可。
    </p>
  </article>
</template>
