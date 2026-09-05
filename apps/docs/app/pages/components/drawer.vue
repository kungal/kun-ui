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

    <h2 class="mt-8 mb-1 text-xl font-semibold">手机端下滑关闭</h2>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:chevron-down"
      title="底部抽屉可以往下拖着关掉"
      description="贴着底边的抽屉(包括 responsive 在 md 以下自动变成的底部 sheet)在触屏上可以往下拖关闭,拖过高度的 25% 或快速一甩即可,不够则回弹,遮罩的暗度跟着手指走。内容还没滚回顶部时,下滑仍然是滚动。左/右/上方向的抽屉、桌面端和鼠标都不受影响;isDismissable=false 拖不动,也可用 isSwipeDismissable=false 单独关掉。"
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
