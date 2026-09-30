<script setup lang="ts">
import ListDetail from '~/examples/splitpane/ListDetail.vue'
import ListDetailSrc from '~/examples/splitpane/ListDetail.vue?raw'
import Aside from '~/examples/splitpane/Aside.vue'
import AsideSrc from '~/examples/splitpane/Aside.vue?raw'
import Stacked from '~/examples/splitpane/Stacked.vue'
import StackedSrc from '~/examples/splitpane/Stacked.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-5xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">列表-详情</h2>
    <p class="text-default-600 mb-3 text-sm">
      宽度以 px 计,由 <code>v-model:size</code> 控制,服务端渲染时就是这个宽度;要记住宽度,在
      <code>resize-end</code> 里写 cookie,下次由服务端读回传给 <code>size</code>。<code>snap-points</code>
      在拖到 8px 以内时吸附,中间的宽度仍然都能停。
    </p>
    <Demo title="ListDetail.vue" :source="ListDetailSrc"><ListDetail /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">主栏 + 辅助栏</h2>
    <Demo title="Aside.vue" :source="AsideSrc"><Aside /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">按自身宽度折成一栏</h2>
    <p class="text-default-600 mb-3 text-sm">
      <code>stack-below</code> 看的是组件自身的宽度(容器查询),不是窗口:放在侧栏旁边或另一栏里时,按实际可用的空间决定。
    </p>
    <Demo title="Stacked.vue" :source="StackedSrc"><Stacked /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunSplitPane.props" />

    <EventsTable :rows="meta.KunSplitPane.events" />
    <SlotsTable :rows="meta.KunSplitPane.slots" />
  </article>
</template>
