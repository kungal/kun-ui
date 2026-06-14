<script setup lang="ts">
import Basic from '~/examples/pininput/Basic.vue'
import BasicSrc from '~/examples/pininput/Basic.vue?raw'
import Masked from '~/examples/pininput/Masked.vue'
import MaskedSrc from '~/examples/pininput/Masked.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">掩码</h2>
    <Demo title="Masked.vue" :source="MaskedSrc"><Masked /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPinInput.props" />
  </article>
</template>
