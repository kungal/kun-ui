<script setup lang="ts">
import Basic from '~/examples/scrollshadow/Basic.vue'
import BasicSrc from '~/examples/scrollshadow/Basic.vue?raw'
import Vertical from '~/examples/scrollshadow/Vertical.vue'
import VerticalSrc from '~/examples/scrollshadow/Vertical.vue?raw'
import Interactive from '~/examples/scrollshadow/Interactive.vue'
import InteractiveSrc from '~/examples/scrollshadow/Interactive.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">鼠标滚轮 + 拖拽(横向)</h2>
    <p class="text-default-500 mb-2 text-sm">
      横向条上,鼠标用户既滚不动也不便拖动。开启 <code class="text-primary">wheel</code>
      后竖直滚轮即可左右滚;<code class="text-primary">draggable</code> 允许按住拖动。
      <code class="text-primary">wheel</code>(=true)到两端会「放手」交还页面滚动;本例用
      <code class="text-primary">wheel="contain"</code>——滚到最前/最后把滚轮留在条上、页面不向下滚
      (仅在条本身可滚时生效,绝不会卡死页面)。触摸设备保持原生滑动。
    </p>
    <Demo title="Interactive.vue" :source="InteractiveSrc"><Interactive /></Demo>

    <p class="text-default-500 mt-3 text-sm">
      滚动条样式由 <code class="text-primary">scrollbar</code> 控制:<code>hide</code>(默认,仅靠边缘阴影)、
      <code>thin</code>(本例所用,细的、跟随主题色的滚动条,纯 CSS 零依赖)、<code>auto</code>(平台原生)。
    </p>

    <p class="text-default-500 mt-6 text-sm">
      建议为可滚动区域设置 <code class="text-primary">aria-label</code>，以便屏幕阅读器识别该区域。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunScrollShadow.props" />

    <EventsTable :rows="meta.KunScrollShadow.events" />
    <SlotsTable :rows="meta.KunScrollShadow.slots" />
  </article>
</template>
