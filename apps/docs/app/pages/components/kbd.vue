<script setup lang="ts">
import Basic from '~/examples/kbd/Basic.vue'
import BasicSrc from '~/examples/kbd/Basic.vue?raw'
import InText from '~/examples/kbd/InText.vue'
import InTextSrc from '~/examples/kbd/InText.vue?raw'
import SearchTrigger from '~/examples/kbd/SearchTrigger.vue'
import SearchTriggerSrc from '~/examples/kbd/SearchTrigger.vue?raw'
import Plain from '~/examples/kbd/Plain.vue'
import PlainSrc from '~/examples/kbd/Plain.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-600 mb-3 text-sm">
      <code>keys</code> 里 <code>+</code> 连接同时按下的键，空格分隔先后按下的键。<code>Mod</code>
      在 Apple 设备上是 ⌘，其它平台是 Ctrl；服务端渲染 Ctrl，Mac 在挂载后切换。读屏器读到的是键名（"Command K"），不是符号。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">行内</h2>
    <p class="text-default-600 mb-3 text-sm">尺寸按 em 计算，放在正文、提示框或按钮里都跟随所在文字的字号。</p>
    <Demo title="InText.vue" :source="InTextSrc"><InText /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">搜索入口</h2>
    <Demo title="SearchTrigger.vue" :source="SearchTriggerSrc"><SearchTrigger /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纯文本</h2>
    <p class="text-default-600 mb-3 text-sm">
      <code>variant="plain"</code> 是菜单里的写法：Apple 上 ⇧⌘Z，其它平台 Ctrl+Shift+Z。
    </p>
    <Demo title="Plain.vue" :source="PlainSrc"><Plain /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunKbd.props" />

    <SlotsTable :rows="meta.KunKbd.slots" />
  </article>
</template>
