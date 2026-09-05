<script setup lang="ts">
import Basic from '~/examples/rating/Basic.vue'
import BasicSrc from '~/examples/rating/Basic.vue?raw'
import Readonly from '~/examples/rating/Readonly.vue'
import ReadonlySrc from '~/examples/rating/Readonly.vue?raw'
import Disabled from '~/examples/rating/Disabled.vue'
import DisabledSrc from '~/examples/rating/Disabled.vue?raw'
import Count from '~/examples/rating/Count.vue'
import CountSrc from '~/examples/rating/Count.vue?raw'
import Sizes from '~/examples/rating/Sizes.vue'
import SizesSrc from '~/examples/rating/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">只读</h2>
    <Demo title="Readonly.vue" :source="ReadonlySrc"><Readonly /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义数量</h2>
    <Demo title="Count.vue" :source="CountSrc"><Count /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunRating.props" />

    <EventsTable :rows="meta.KunRating.events" />
    <SlotsTable :rows="meta.KunRating.slots" />
  </article>
</template>
