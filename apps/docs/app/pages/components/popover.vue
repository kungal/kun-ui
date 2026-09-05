<script setup lang="ts">
import Basic from '~/examples/popover/Basic.vue'
import BasicSrc from '~/examples/popover/Basic.vue?raw'
import Placements from '~/examples/popover/Placements.vue'
import PlacementsSrc from '~/examples/popover/Placements.vue?raw'
import Arrow from '~/examples/popover/Arrow.vue'
import ArrowSrc from '~/examples/popover/Arrow.vue?raw'
import RichContent from '~/examples/popover/RichContent.vue'
import RichContentSrc from '~/examples/popover/RichContent.vue?raw'
import HoverMenu from '~/examples/popover/HoverMenu.vue'
import HoverMenuSrc from '~/examples/popover/HoverMenu.vue?raw'
import RailFlyout from '~/examples/popover/RailFlyout.vue'
import RailFlyoutSrc from '~/examples/popover/RailFlyout.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">位置</h2>
    <Demo title="Placements.vue" :source="PlacementsSrc"><Placements /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">箭头</h2>
    <Demo title="Arrow.vue" :source="ArrowSrc"><Arrow /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">富内容</h2>
    <Demo title="RichContent.vue" :source="RichContentSrc"><RichContent /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">悬停菜单(导航)</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>trigger="hover"</code> + 共享 <code>group</code> = 导航悬停菜单。横向移到兄弟项**瞬间切换**;
      下移到面板靠**坐标安全三角**不会中途关闭(且面板是 teleport 的也照样work);悬停**不抢焦点**;
      点击 / 键盘 / Esc 仍可用,**触屏自动退回点击**。动作菜单(<code>KunDropdown</code>)仍只用点击。
      若站点用 <code>--kun-surface-opacity</code> 全局磨砂了表面,给菜单加 <code>opaque</code> 保持实心可读
      (直接在面板上写 <code>--kun-surface-opacity:1</code> 无效——主题色在 <code>:root</code> 解析)。
    </p>
    <Demo title="HoverMenu.vue" :source="HoverMenuSrc"><HoverMenu /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">侧边飞出菜单(导航栏)</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>position="right-start"</code> 让菜单贴着 tile 顶部**向右**展开——侧边导航栏的
      经典交互。关键在于 <code>autoPosition</code>(默认开启)的**碰撞感知**:靠近视口底部的
      高菜单会由 <code>shift()</code> 上移、<code>size()</code> 把高度限制到**可用空间**并自动
      滚动,始终留在屏幕内,而不是从固定锚点冲出底部被裁切。过去只能手写
      <code>absolute left-full + max-h-[80vh]</code> 的场景,现在直接交给 KunPopover。
    </p>
    <Demo title="RailFlyout.vue" :source="RailFlyoutSrc"><RailFlyout /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPopover.props" />

    <EventsTable :rows="meta.KunPopover.events" />
    <SlotsTable :rows="meta.KunPopover.slots" />
  </article>
</template>
