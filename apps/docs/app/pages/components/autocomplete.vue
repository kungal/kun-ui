<script setup lang="ts">
import Basic from '~/examples/autocomplete/Basic.vue'
import BasicSrc from '~/examples/autocomplete/Basic.vue?raw'
import CustomValue from '~/examples/autocomplete/CustomValue.vue'
import CustomValueSrc from '~/examples/autocomplete/CustomValue.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义值</h2>
    <Demo title="CustomValue.vue" :source="CustomValueSrc"><CustomValue /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunAutocomplete.props" />
  </article>
</template>
