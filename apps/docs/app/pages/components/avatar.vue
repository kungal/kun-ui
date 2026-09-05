<script setup lang="ts">
import Basic from '~/examples/avatar/Basic.vue'
import BasicSrc from '~/examples/avatar/Basic.vue?raw'
import Sizes from '~/examples/avatar/Sizes.vue'
import SizesSrc from '~/examples/avatar/Sizes.vue?raw'
import StickerFallback from '~/examples/avatar/StickerFallback.vue'
import StickerFallbackSrc from '~/examples/avatar/StickerFallback.vue?raw'
import Navigation from '~/examples/avatar/Navigation.vue'
import NavigationSrc from '~/examples/avatar/Navigation.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">贴纸兜底</h2>
    <Demo title="StickerFallback.vue" :source="StickerFallbackSrc"><StickerFallback /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可点击跳转</h2>
    <Demo title="Navigation.vue" :source="NavigationSrc"><Navigation /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunAvatar.props" />

    <EventsTable :rows="meta.KunAvatar.events" />
    <SlotsTable :rows="meta.KunAvatar.slots" />
  </article>
</template>
