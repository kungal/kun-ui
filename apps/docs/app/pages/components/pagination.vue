<script setup lang="ts">
import Basic from '~/examples/pagination/Basic.vue'
import BasicSrc from '~/examples/pagination/Basic.vue?raw'
import Few from '~/examples/pagination/Few.vue'
import FewSrc from '~/examples/pagination/Few.vue?raw'
import Loading from '~/examples/pagination/Loading.vue'
import LoadingSrc from '~/examples/pagination/Loading.vue?raw'
import Crawlable from '~/examples/pagination/Crawlable.vue'
import CrawlableSrc from '~/examples/pagination/Crawlable.vue?raw'
import InPlace from '~/examples/pagination/InPlace.vue'
import InPlaceSrc from '~/examples/pagination/InPlace.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">列表内换页</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      分页放在长列表下方、在原地换数据时，视口不会自己动：用户点完「第 2 页」看到的是新一页的末尾。
      KunPagination 不替你滚动——它不知道列表在哪、数据何时到达、页头吸顶多高，也不知道这次该不该跳。
      Nuxt 下 <code class="text-primary">page-href</code> 也一样：只改 query 的导航（<code>?page=2</code>）
      默认保持滚动位置。所以由页面来做，做法是：
    </p>
    <ul class="text-foreground-muted mb-2 list-disc space-y-1 pl-5 text-sm">
      <li>等新一页<strong>渲染完成</strong>（数据到达 + <code>nextTick</code>）再动，否则会停在旧内容上、随后又被高度变化推走。</li>
      <li>只在列表开头已经滚出视口时才动；在顶部的分页条上换页不应跳。</li>
      <li>目标是列表的标题，不是页面顶部；用 <code class="text-primary">scroll-margin-top</code> 让出吸顶页头。</li>
      <li>
        把焦点移到这个标题（<code>tabindex="-1"</code>，<code>focus({ preventScroll: true })</code>）再
        <code>scrollIntoView</code>：键盘和读屏用户从新内容开头继续，标题里带上页码，换页就会被读出。
      </li>
      <li><code>prefers-reduced-motion</code> 下不用平滑滚动。</li>
    </ul>
    <p class="text-foreground-muted mb-2 text-sm">
      加载期间分页按钮和跳页输入框不可操作但<strong>保持焦点</strong>（<code>aria-disabled</code> /
      <code>readonly</code>，而不是原生 <code>disabled</code>）；列表开头仍在视口内、没有移动焦点时，键盘用户留在刚按下的按钮上。
    </p>
    <Demo title="InPlace.vue" :source="InPlaceSrc"><InPlace /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPagination.props" />

    <EventsTable :rows="meta.KunPagination.events" />
    <SlotsTable :rows="meta.KunPagination.slots" />
  </article>
</template>
