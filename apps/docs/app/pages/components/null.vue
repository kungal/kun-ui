<script setup lang="ts">
import Basic from '~/examples/null/Basic.vue'
import BasicSrc from '~/examples/null/Basic.vue?raw'
import Description from '~/examples/null/Description.vue'
import DescriptionSrc from '~/examples/null/Description.vue?raw'
import NoSticker from '~/examples/null/NoSticker.vue'
import NoStickerSrc from '~/examples/null/NoSticker.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义文案</h2>
    <Demo title="Description.vue" :source="DescriptionSrc"><Description /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">隐藏图片</h2>
    <Demo title="NoSticker.vue" :source="NoStickerSrc"><NoSticker /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunNull.props" />

    <EventsTable :rows="meta.KunNull.events" />
    <SlotsTable :rows="meta.KunNull.slots" />
  </article>
</template>
