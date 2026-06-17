<script setup lang="ts">
import Basic from '~/examples/carousel/Basic.vue'
import BasicSrc from '~/examples/carousel/Basic.vue?raw'
import MultiView from '~/examples/carousel/MultiView.vue'
import MultiViewSrc from '~/examples/carousel/MultiView.vue?raw'
import Autoplay from '~/examples/carousel/Autoplay.vue'
import AutoplaySrc from '~/examples/carousel/Autoplay.vue?raw'
import meta from '~/generated/component-meta.json'

const carouselProps = meta.KunCarousel.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">多图视图 (slidesPerView)</h2>
    <Demo title="MultiView.vue" :source="MultiViewSrc"><MultiView /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自动播放</h2>
    <Demo title="Autoplay.vue" :source="AutoplaySrc"><Autoplay /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="carouselProps" />
  </article>
</template>
