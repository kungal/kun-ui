<script setup lang="ts">
import Basic from '~/examples/icon/Basic.vue'
import BasicSrc from '~/examples/icon/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <KunInfo
      class="mt-6"
      color="info"
      icon="lucide:info"
      title="仅限内置"
      description="使用 lucide:check 这类内置名称。自定义图标用 @kungal/ui-core 的 registerKunIcon(s) 注册;未知名称会回退到注入的 iconComponent(Nuxt 层下为 @nuxt/icon)。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunIcon.props" />
  </article>
</template>
