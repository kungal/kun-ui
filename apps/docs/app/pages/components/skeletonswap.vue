<script setup lang="ts">
import FirstLoad from '~/examples/skeletonswap/FirstLoad.vue'
import FirstLoadSrc from '~/examples/skeletonswap/FirstLoad.vue?raw'
import Refetch from '~/examples/skeletonswap/Refetch.vue'
import RefetchSrc from '~/examples/skeletonswap/Refetch.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">进入页面</h2>
    <p class="text-default-600 mb-3 text-sm">
      默认插槽放真实内容,<code>#skeleton</code> 插槽放用 <code>KunSkeleton</code> 拼出的占位布局。<code>loading</code>
      持续超过 <code>delay</code>(默认 150ms)才显示骨架,更快的请求直接出内容,不闪;骨架一旦出现至少停留
      <code>min-duration</code>(默认 300ms)。等待期间骨架已按原尺寸排好、只是不可见,所以它出现时页面不会跳动。
      创建时 <code>loading</code> 已为 false(服务端渲染等到了数据)就直接渲染内容,没有骨架也没有淡入。
    </p>
    <Demo title="FirstLoad.vue" :source="FirstLoadSrc"><FirstLoad /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">刷新已有内容</h2>
    <p class="text-default-600 mb-3 text-sm">
      已有内容时重新加载,<code>delay</code> 内旧内容原样保留、仍可操作,快的请求看不到任何变化;超过 <code>delay</code>
      才淡出成骨架,淡出中的旧内容是 <code>inert</code>。所以默认插槽在加载期间仍会渲染,要能用上一次的数据画出来。
      触发加载的控件(如分页)放在组件外面,内容换掉时焦点才不会丢。
    </p>
    <Demo title="Refetch.vue" :source="RefetchSrc"><Refetch /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">布局与无障碍</h2>
    <p class="text-default-600 mb-3 text-sm">
      根元素是一个真实的 <code>div</code>,两层叠在同一个 grid 单元格里交叉淡入淡出,不用定位也不用 <code>z-index</code>,
      不会盖到区域外面;<code>class</code> 里的 <code>display</code> 会被覆盖,内容自己的布局写在插槽里。
      加载期间根元素带 <code>aria-busy="true"</code>,骨架层是 <code>aria-hidden</code> 且 <code>inert</code>。
      需要读屏器在加载完成后播报时,自己在根元素上加 <code>aria-live="polite"</code>;整页内容不要加。
      淡入淡出只在 <code>prefers-reduced-motion: no-preference</code> 下进行。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunSkeletonSwap.props" />

    <SlotsTable :rows="meta.KunSkeletonSwap.slots" />
  </article>
</template>
