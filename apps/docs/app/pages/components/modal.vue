<script setup lang="ts">
import Basic from '~/examples/modal/Basic.vue'
import BasicSrc from '~/examples/modal/Basic.vue?raw'
import Sizes from '~/examples/modal/Sizes.vue'
import SizesSrc from '~/examples/modal/Sizes.vue?raw'
import Placement from '~/examples/modal/Placement.vue'
import PlacementSrc from '~/examples/modal/Placement.vue?raw'
import ScrollBehavior from '~/examples/modal/ScrollBehavior.vue'
import ScrollBehaviorSrc from '~/examples/modal/ScrollBehavior.vue?raw'
import NonDismissable from '~/examples/modal/NonDismissable.vue'
import NonDismissableSrc from '~/examples/modal/NonDismissable.vue?raw'
import AlertDialog from '~/examples/modal/AlertDialog.vue'
import AlertDialogSrc from '~/examples/modal/AlertDialog.vue?raw'
import Focus from '~/examples/modal/Focus.vue'
import FocusSrc from '~/examples/modal/Focus.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">位置</h2>
    <Demo title="Placement.vue" :source="PlacementSrc"><Placement /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">滚动行为</h2>
    <Demo title="ScrollBehavior.vue" :source="ScrollBehaviorSrc">
      <ScrollBehavior />
    </Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不可关闭与隐藏关闭按钮</h2>
    <Demo title="NonDismissable.vue" :source="NonDismissableSrc">
      <NonDismissable />
    </Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">警告对话框</h2>
    <Demo title="AlertDialog.vue" :source="AlertDialogSrc"><AlertDialog /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">打开与关闭时的焦点</h2>
    <p class="text-default-600 mb-3 text-sm">
      打开时焦点默认落在对话框里第一个可 Tab 的元素上,通常是关闭按钮。<code>initial-focus</code>
      指定另一个目标:在对话框内部匹配的 CSS 选择器、元素,或返回元素的函数;找不到时退回默认。没有它时,带原生
      <code>autofocus</code> 属性的元素优先,与原生 <code>&lt;dialog&gt;</code> 一致。关闭时焦点默认回到打开前聚焦的元素;
      <code>:return-focus="false"</code> 不动焦点,由你自己放回去,例如编辑器把光标放回原处。在关闭之后(<code>nextTick</code>
      或 <code>await</code> 之后)再聚焦:关闭生效前,对话框外的页面还是 <code>inert</code>,聚焦会落空。
    </p>
    <Demo title="Focus.vue" :source="FocusSrc"><Focus /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">手机端下滑关闭</h2>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:chevron-down"
      title="把 sheet 往下拖就能关掉"
      description="placement=&quot;auto&quot; 在 md 以下是底部 sheet,触屏上可以按住往下拖关闭 —— 拖过面板高度的 25%,或者快速一甩(0.4 px/ms)即可,不够则回弹。面板顶部那条小横杠就是这个手势的提示。内容滚动优先:只要 sheet 里的内容还没滚回顶部,下滑就是滚动而不是关闭,所以长内容不会被误关。桌面端、鼠标和 placement=&quot;center&quot;/&quot;top&quot; 都不受影响;role=&quot;alertdialog&quot; 和 isDismissable=false 同样拖不动。用 isSwipeDismissable=false 可以单独关掉。"
    />

    <h2 class="mt-8 mb-1 text-xl font-semibold">Android 返回键</h2>
    <KunInfo
      class="mt-3"
      color="primary"
      icon="lucide:arrow-left"
      title="返回键关闭对话框,而不是退回上一页"
      description="在 Android 上打开对话框时,按返回键或使用返回手势会关掉最上层的对话框,页面留在原地 —— 与原生 dialog 元素的行为一致。桌面端不受影响(桌面唯一的关闭请求是 Esc,由组件自己处理)。iOS 没有返回键,不适用。isDismissable=false 时不生效;路由绑定的对话框可用 isCloseRequestDismissable=false 关掉这个行为。KunUI 不会向 history 里写任何东西,不会干扰你的路由。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunModal.props" />

    <EventsTable :rows="meta.KunModal.events" />
    <SlotsTable :rows="meta.KunModal.slots" />
  </article>
</template>
