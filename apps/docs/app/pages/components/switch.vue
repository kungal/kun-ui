<script setup lang="ts">
import Basic from '~/examples/switch/Basic.vue'
import BasicSrc from '~/examples/switch/Basic.vue?raw'
import Sizes from '~/examples/switch/Sizes.vue'
import SizesSrc from '~/examples/switch/Sizes.vue?raw'
import Description from '~/examples/switch/Description.vue'
import DescriptionSrc from '~/examples/switch/Description.vue?raw'
import Disabled from '~/examples/switch/Disabled.vue'
import DisabledSrc from '~/examples/switch/Disabled.vue?raw'
import Error from '~/examples/switch/Error.vue'
import ErrorSrc from '~/examples/switch/Error.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">带标签与描述</h2>
    <Demo title="Description.vue" :source="DescriptionSrc"><Description /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误</h2>
    <Demo title="Error.vue" :source="ErrorSrc"><Error /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunSwitch.props" />
  </article>
</template>
