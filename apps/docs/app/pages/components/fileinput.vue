<script setup lang="ts">
import Basic from '~/examples/fileinput/Basic.vue'
import BasicSrc from '~/examples/fileinput/Basic.vue?raw'
import Multiple from '~/examples/fileinput/Multiple.vue'
import MultipleSrc from '~/examples/fileinput/Multiple.vue?raw'
import CustomTrigger from '~/examples/fileinput/CustomTrigger.vue'
import CustomTriggerSrc from '~/examples/fileinput/CustomTrigger.vue?raw'
import States from '~/examples/fileinput/States.vue'
import StatesSrc from '~/examples/fileinput/States.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">多文件</h2>
    <Demo title="Multiple.vue" :source="MultipleSrc"><Multiple /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义触发器</h2>
    <Demo title="CustomTrigger.vue" :source="CustomTriggerSrc"><CustomTrigger /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用与错误</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunFileInput.props" />
  </article>
</template>
