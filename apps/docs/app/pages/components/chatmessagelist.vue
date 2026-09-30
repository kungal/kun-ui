<script setup lang="ts">
import Direct from '~/examples/chatmessagelist/Direct.vue'
import DirectSrc from '~/examples/chatmessagelist/Direct.vue?raw'
import Group from '~/examples/chatmessagelist/Group.vue'
import GroupSrc from '~/examples/chatmessagelist/Group.vue?raw'
import Paging from '~/examples/chatmessagelist/Paging.vue'
import PagingSrc from '~/examples/chatmessagelist/Paging.vue?raw'
import Thousands from '~/examples/chatmessagelist/Thousands.vue'
import ThousandsSrc from '~/examples/chatmessagelist/Thousands.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <p class="text-foreground-muted mt-4 text-sm">
      消息直接吃 chat API 的 JSON(<code>KunChatMessage</code>,id 是字符串)。滚动容器是
      <code>flex-direction: column-reverse</code>,滚动原点在底部:服务端渲染的 HTML 就停在最新消息,
      上方的任何增长(更早的一页、渲染进来的行、解码完成的图片)都不改变视图,也就不写一次 scrollTop——
      iOS 的惯性滚动不会被打断。只有视口下方的变化才需要手动锚定。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">私聊:从未读处打开</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      <code>last-read-seq</code> 取打开会话时的已读位置,之后保持不变——分隔线就停在那里,列表从它开始显示;
      <code>@read</code> 报告真正看到的位置,由站点去标记已读。右键或长按消息弹出菜单,触屏上左滑回复。
    </p>
    <Demo title="Direct.vue" :source="DirectSrc"><Direct /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">群聊、服务消息与跳转</h2>
    <Demo title="Group.vue" :source="GroupSrc"><Group /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">双向翻页与窗口</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      向上滚到顶附近发出 <code>load-older</code>,更早的一页出现在上方而视图不动;
      跳到没载入的消息时发出 <code>jump</code>,站点按 <code>around_seq</code> 取一个窗口再调
      <code>scrollToSeq</code>;窗口不含最新消息时 <code>has-newer</code> 为真,回到底部按钮发出
      <code>latest</code>。
    </p>
    <Demo title="Paging.vue" :source="PagingSrc"><Paging /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">几千条消息</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      不引入虚拟滚动库:屏幕外的行用 <code>content-visibility: auto</code> 跳过布局与绘制,
      <code>contain-intrinsic-size: auto</code> 记住已渲染过的高度,回滚不跳。
    </p>
    <Demo title="Thousands.vue" :source="ThousandsSrc"><Thousands /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatMessageList.props" />
    <EventsTable :rows="meta.KunChatMessageList.events" />
    <SlotsTable :rows="meta.KunChatMessageList.slots" />
  </article>
</template>
