<script setup lang="ts">
import Basic from '~/examples/image/Basic.vue'
import BasicSrc from '~/examples/image/Basic.vue?raw'
import AspectRatio from '~/examples/image/AspectRatio.vue'
import AspectRatioSrc from '~/examples/image/AspectRatio.vue?raw'
import ObjectFit from '~/examples/image/ObjectFit.vue'
import ObjectFitSrc from '~/examples/image/ObjectFit.vue?raw'
import Skeleton from '~/examples/image/Skeleton.vue'
import SkeletonSrc from '~/examples/image/Skeleton.vue?raw'
import Fallback from '~/examples/image/Fallback.vue'
import FallbackSrc from '~/examples/image/Fallback.vue?raw'
import Loading from '~/examples/image/Loading.vue'
import LoadingSrc from '~/examples/image/Loading.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">宽高比</h2>
    <Demo title="AspectRatio.vue" :source="AspectRatioSrc"><AspectRatio /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">填充方式</h2>
    <Demo title="ObjectFit.vue" :source="ObjectFitSrc"><ObjectFit /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">骨架屏</h2>
    <Demo title="Skeleton.vue" :source="SkeletonSrc"><Skeleton /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">加载失败回退</h2>
    <Demo title="Fallback.vue" :source="FallbackSrc"><Fallback /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">懒加载与即时加载</h2>
    <Demo title="Loading.vue" :source="LoadingSrc"><Loading /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunImage.props" />
  </article>
</template>
