<script setup lang="ts">
import Basic from '~/examples/hovercard/Basic.vue'
import BasicSrc from '~/examples/hovercard/Basic.vue?raw'
import Group from '~/examples/hovercard/Group.vue'
import GroupSrc from '~/examples/hovercard/Group.vue?raw'
import LazyContent from '~/examples/hovercard/LazyContent.vue'
import LazyContentSrc from '~/examples/hovercard/LazyContent.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      鼠标停在链接上 <code>openDelay</code>(默认 600ms)后浮出,移开后留
      <code>closeDelay</code> 的余量,沿安全三角移进卡片不会关闭,卡片里的按钮照常可点。
      <strong>点击不被拦截</strong>:点头像照常跟随链接,同时关闭卡片,不会跟着页面切换残留。
      触屏上不出现——轻点就是打开链接。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">列表中的分组</h2>
    <p class="text-default-500 mb-2 text-sm">
      同一 <code>group</code> 的卡片同时只开一张;一张打开后移到相邻头像立即切换,不再等
      <code>openDelay</code>。触发器外层是 <code>display: contents</code>,
      不产生盒子,放进 flex 行里不改变头像的布局。
    </p>
    <Demo title="Group.vue" :source="GroupSrc"><Group /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">打开时加载</h2>
    <p class="text-default-500 mb-2 text-sm">
      卡片内容只在打开期间挂载,放在内容组件 setup 里的请求就是在打开时发出的。
      需要在外面知道开合(预取、埋点)时绑定 <code>v-model:open</code>。
    </p>
    <Demo title="LazyContent.vue" :source="LazyContentSrc"><LazyContent /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">键盘与读屏</h2>
    <p class="text-default-500 mb-2 text-sm">
      键盘 Tab 到链接(<code>:focus-visible</code>)时同样在 <code>openDelay</code> 后打开,
      离开或按 Esc 关闭;鼠标点击带来的聚焦不会打开。卡片是补充预览:没有 role,
      不移动焦点,也不在 Tab 顺序里,链接本身始终是唯一的可访问入口——所以不要把
      目标页面上没有的信息或操作只放在卡片里。需要可交互、可聚焦的浮层用
      <NuxtLink to="/components/popover">KunPopover</NuxtLink>。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunHoverCard.props" />

    <EventsTable :rows="meta.KunHoverCard.events" />
    <SlotsTable :rows="meta.KunHoverCard.slots" />
  </article>
</template>
