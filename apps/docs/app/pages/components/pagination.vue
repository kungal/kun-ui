<script setup lang="ts">
import Basic from '~/examples/pagination/Basic.vue'
import BasicSrc from '~/examples/pagination/Basic.vue?raw'
import Few from '~/examples/pagination/Few.vue'
import FewSrc from '~/examples/pagination/Few.vue?raw'
import Loading from '~/examples/pagination/Loading.vue'
import LoadingSrc from '~/examples/pagination/Loading.vue?raw'
import Crawlable from '~/examples/pagination/Crawlable.vue'
import CrawlableSrc from '~/examples/pagination/Crawlable.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">少量页码</h2>
    <Demo title="Few.vue" :source="FewSrc"><Few /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">加载中</h2>
    <Demo title="Loading.vue" :source="LoadingSrc"><Loading /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可爬链接</h2>
    <Demo title="Crawlable.vue" :source="CrawlableSrc"><Crawlable /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPagination.props" />

    <EventsTable :rows="meta.KunPagination.events" />
    <SlotsTable :rows="meta.KunPagination.slots" />
  </article>
</template>
