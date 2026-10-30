<script setup lang="ts">
import Basic from '~/examples/drawer/Basic.vue'
import BasicSrc from '~/examples/drawer/Basic.vue?raw'
import Placement from '~/examples/drawer/Placement.vue'
import PlacementSrc from '~/examples/drawer/Placement.vue?raw'
import Sizes from '~/examples/drawer/Sizes.vue'
import SizesSrc from '~/examples/drawer/Sizes.vue?raw'
import Title from '~/examples/drawer/Title.vue'
import TitleSrc from '~/examples/drawer/Title.vue?raw'
import NonDismissable from '~/examples/drawer/NonDismissable.vue'
import NonDismissableSrc from '~/examples/drawer/NonDismissable.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">方向</h2>
    <Demo title="Placement.vue" :source="PlacementSrc"><Placement /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带标题</h2>
    <Demo title="Title.vue" :source="TitleSrc"><Title /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不可关闭</h2>
    <Demo title="NonDismissable.vue" :source="NonDismissableSrc">
      <NonDismissable />
    </Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">手机端滑动关闭</h2>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:chevron-down"
      title="把抽屉推回它来的那条边就能关掉"
      description="触屏上,底部抽屉(包括 responsive 在 md 以下自动变成的底部 sheet)往下拖、顶部往上、左侧往左、右侧往右,拖过尺寸的 25% 或快速一甩即可关闭,不够则回弹;拖出去后又快速往回甩,不管拖了多远都会留下,和原生 Android 抽屉一致。遮罩的暗度跟着手指走。只看这条轴:侧边抽屉里列表的上下滑动照常滚动;还能往同方向滚动的内容(没滚回顶部的列表、没滚到头的横向标签栏)先拿走手势;用 touch-action 声明自己处理这条轴的元素(例如带滑动操作的 KunChatConversationItem)也不会被抢。只有底部 sheet 画拖动把手。桌面端和鼠标不受影响;isDismissable=false 拖不动,也可用 isSwipeDismissable=false 单独关掉。"
    />

    <h2 class="mt-8 mb-1 text-xl font-semibold">Android 返回键</h2>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:arrow-left"
      title="返回键关闭抽屉,而不是退回上一页"
      description="在 Android 上打开抽屉时,按返回键或使用返回手势会关掉最上层的抽屉,页面留在原地。桌面端与 iOS 不受影响。isDismissable=false 时不生效,也可用 isCloseRequestDismissable=false 单独关掉。KunUI 不会向 history 里写任何东西,不会干扰你的路由。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunDrawer.props" />

    <EventsTable :rows="meta.KunDrawer.events" />
    <SlotsTable :rows="meta.KunDrawer.slots" />
  </article>
</template>
