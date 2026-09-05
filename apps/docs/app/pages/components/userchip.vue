<script setup lang="ts">
import Basic from '~/examples/userchip/Basic.vue'
import BasicSrc from '~/examples/userchip/Basic.vue?raw'
import Description from '~/examples/userchip/Description.vue'
import DescriptionSrc from '~/examples/userchip/Description.vue?raw'
import Navigation from '~/examples/userchip/Navigation.vue'
import NavigationSrc from '~/examples/userchip/Navigation.vue?raw'
import Truncate from '~/examples/userchip/Truncate.vue'
import TruncateSrc from '~/examples/userchip/Truncate.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带描述</h2>
    <Demo title="Description.vue" :source="DescriptionSrc"><Description /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可点击</h2>
    <Demo title="Navigation.vue" :source="NavigationSrc"><Navigation /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">长文本截断</h2>
    <Demo title="Truncate.vue" :source="TruncateSrc"><Truncate /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunUserChip.props" />

    <EventsTable :rows="meta.KunUserChip.events" />
    <SlotsTable :rows="meta.KunUserChip.slots" />
  </article>
</template>
