<script setup lang="ts">
import Basic from '~/examples/banner/Basic.vue'
import BasicSrc from '~/examples/banner/Basic.vue?raw'
import Colors from '~/examples/banner/Colors.vue'
import ColorsSrc from '~/examples/banner/Colors.vue?raw'
import Actions from '~/examples/banner/Actions.vue'
import ActionsSrc from '~/examples/banner/Actions.vue?raw'
import Persist from '~/examples/banner/Persist.vue'
import PersistSrc from '~/examples/banner/Persist.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色与变体</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">链接与操作</h2>
    <Demo title="Actions.vue" :source="ActionsSrc"><Actions /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">记住关闭状态</h2>
    <Demo title="Persist.vue" :source="PersistSrc"><Persist /></Demo>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:info"
      title="服务端渲染也不会闪"
      description="设置 storageKey 后,关闭状态写进 localStorage。服务端读不到 localStorage,所以横幅前面会渲染一段很短的内联脚本:浏览器解析到它时横幅还没画出来,已关闭的横幅在第一帧就是隐藏的,不闪、不跳。每条公告用一个新的 storageKey,关过旧公告的人会重新看到新公告。站点的 CSP 禁止内联脚本时,传入 nonce。"
    />
    <KunInfo
      class="mt-3"
      color="default"
      icon="lucide:info"
      title="也可以用 Cookie"
      description="不设 storageKey,把 v-model 绑到 Nuxt 的 useCookie 上,服务端就能直接不渲染已关闭的横幅,连脚本都不需要。代价是页面 HTML 因人而异,不能再整页缓存到 CDN 或预渲染。"
    />

    <h2 class="mt-8 mb-1 text-xl font-semibold">放在哪里</h2>
    <KunInfo
      class="mt-3"
      color="default"
      icon="lucide:info"
      title="页面最上方,随页面滚走"
      description="把 KunBanner 放在布局的第一个元素,在吸顶导航栏之上。它在正常文档流里,不固定、不吸顶:吸顶的横幅会一直挡住页面内容,键盘聚焦的元素可能被它盖住(WCAG 2.4.11)。同一页面只放一条。它是一个带名字的 region 地标,不是 role=alert —— 随页面一起到达的内容不会被 alert 播报,页面加载后插入的又会打断读屏。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunBanner.props" />

    <EventsTable :rows="meta.KunBanner.events" />
    <SlotsTable :rows="meta.KunBanner.slots" />
  </article>
</template>
