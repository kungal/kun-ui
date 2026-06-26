<script setup lang="ts">
import Basic from '~/examples/content/Basic.vue'
import BasicSrc from '~/examples/content/Basic.vue?raw'
import Typography from '~/examples/content/Typography.vue'
import TypographySrc from '~/examples/content/Typography.vue?raw'
import Spoiler from '~/examples/content/Spoiler.vue'
import SpoilerSrc from '~/examples/content/Spoiler.vue?raw'
import LongSpoiler from '~/examples/content/LongSpoiler.vue'
import LongSpoilerSrc from '~/examples/content/LongSpoiler.vue?raw'
import Lightbox from '~/examples/content/Lightbox.vue'
import LightboxSrc from '~/examples/content/Lightbox.vue?raw'
import BlurUp from '~/examples/content/BlurUp.vue'
import BlurUpSrc from '~/examples/content/BlurUp.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">Markdown 排版</h2>
    <Demo title="Typography.vue" :source="TypographySrc"><Typography /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">剧透</h2>
    <Demo title="Spoiler.vue" :source="SpoilerSrc"><Spoiler /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">超长多段剧透</h2>
    <Demo title="LongSpoiler.vue" :source="LongSpoilerSrc"><LongSpoiler /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">内联图片灯箱</h2>
    <Demo title="Lightbox.vue" :source="LightboxSrc"><Lightbox /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">正文图模糊占位(ThumbHash)</h2>
    <p class="text-default-500 mb-2 text-sm">
      正文图是后端渲染的原始 <code>&lt;img&gt;</code>(不是组件)。只要标签带
      <code class="text-primary">width</code>/<code class="text-primary">height</code>(浏览器据此原生预留空间、消除加载抖动)与
      <code class="text-primary">data-thumbhash</code>,KunContent 就会自动把解码出的模糊占位画到图片背景上,加载完成后清除——
      零 DOM 改动,与灯箱、剧透共存。
    </p>
    <Demo title="BlurUp.vue" :source="BlurUpSrc"><BlurUp /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunContent.props" />
  </article>
</template>
