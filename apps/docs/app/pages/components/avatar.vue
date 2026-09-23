<script setup lang="ts">
import Basic from '~/examples/avatar/Basic.vue'
import BasicSrc from '~/examples/avatar/Basic.vue?raw'
import Sizes from '~/examples/avatar/Sizes.vue'
import SizesSrc from '~/examples/avatar/Sizes.vue?raw'
import StickerFallback from '~/examples/avatar/StickerFallback.vue'
import StickerFallbackSrc from '~/examples/avatar/StickerFallback.vue?raw'
import Navigation from '~/examples/avatar/Navigation.vue'
import NavigationSrc from '~/examples/avatar/Navigation.vue?raw'
import Decoration from '~/examples/avatar/Decoration.vue'
import DecorationSrc from '~/examples/avatar/Decoration.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">贴纸兜底</h2>
    <p class="text-default-500 mb-2 text-sm">
      没有头像的用户会从 <code>avatarFallbackPool</code> 里按名字哈希取一张，同一个人永远拿到同一张。
      这个池子由宿主应用提供（KunUI 不内置任何外部地址）——不配置的话，所有人都会渲染同一张内置兜底图。
      配置方法见
      <KunLink
        href="https://github.com/kungal/kun-ui/blob/main/docs/INTEGRATION.md#71-the-avatar-fallback-pool"
        target="_blank"
        color="primary"
        >INTEGRATION.md §7.1</KunLink
      >。
    </p>
    <Demo title="StickerFallback.vue" :source="StickerFallbackSrc"><StickerFallback /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可点击跳转</h2>
    <Demo title="Navigation.vue" :source="NavigationSrc"><Navigation /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">头像框</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>user.avatarDecoration</code> 是画在头像外面的头像框：素材是头像 1.2 倍的正方形画布，头像圆居中。
      头像框每边伸出 10%，不占布局、不接收点击。<code>decoration</code> 决定动图什么时候播放：默认
      <code>hover</code> 只在悬停或获得焦点时播放，<code>always</code> 一直播放，<code>static</code> 只用静态图，
      <code>none</code> 不画。<code>sm</code> 及更小的尺寸不画头像框；开启了减弱动态效果的读者永远只看到静态图。
    </p>
    <Demo title="Decoration.vue" :source="DecorationSrc"><Decoration /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunAvatar.props" />

    <EventsTable :rows="meta.KunAvatar.events" />
    <SlotsTable :rows="meta.KunAvatar.slots" />
  </article>
</template>
