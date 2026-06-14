<script setup lang="ts">
import Basic from '~/examples/content/Basic.vue'
import BasicSrc from '~/examples/content/Basic.vue?raw'
import Spoiler from '~/examples/content/Spoiler.vue'
import SpoilerSrc from '~/examples/content/Spoiler.vue?raw'
import Lightbox from '~/examples/content/Lightbox.vue'
import LightboxSrc from '~/examples/content/Lightbox.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <KunInfo
      class="mt-6"
      color="danger"
      icon="lucide:triangle-alert"
      title="KunContent 不会 sanitize HTML"
      description="它原样渲染你传入的内容。绑定到 content 之前,请自行 sanitize 任何不可信 / 用户提供的 HTML(例如用 DOMPurify)。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">剧透</h2>
    <Demo title="Spoiler.vue" :source="SpoilerSrc"><Spoiler /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">内联图片灯箱</h2>
    <Demo title="Lightbox.vue" :source="LightboxSrc"><Lightbox /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunContent.props" />
  </article>
</template>
