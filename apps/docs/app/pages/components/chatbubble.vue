<script setup lang="ts">
import Basic from '~/examples/chatbubble/Basic.vue'
import BasicSrc from '~/examples/chatbubble/Basic.vue?raw'
import Reply from '~/examples/chatbubble/Reply.vue'
import ReplySrc from '~/examples/chatbubble/Reply.vue?raw'
import Media from '~/examples/chatbubble/Media.vue'
import MediaSrc from '~/examples/chatbubble/Media.vue?raw'
import Status from '~/examples/chatbubble/Status.vue'
import StatusSrc from '~/examples/chatbubble/Status.vue?raw'
import Reactions from '~/examples/chatbubble/Reactions.vue'
import ReactionsSrc from '~/examples/chatbubble/Reactions.vue?raw'
import Service from '~/examples/chatbubble/Service.vue'
import ServiceSrc from '~/examples/chatbubble/Service.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />
    <p class="text-default-500 mt-4 text-sm">
      通常由 <code>KunChatMessageList</code> 渲染并排好位置;单独使用时自己决定左右对齐。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法与连续消息</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">回复与引用</h2>
    <Demo title="Reply.vue" :source="ReplySrc"><Reply /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">照片与相册</h2>
    <Demo title="Media.vue" :source="MediaSrc"><Media /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">发送状态</h2>
    <Demo title="Status.vue" :source="StatusSrc"><Status /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">回应</h2>
    <Demo title="Reactions.vue" :source="ReactionsSrc"><Reactions /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">服务消息与上下文卡片</h2>
    <Demo title="Service.vue" :source="ServiceSrc"><Service /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatBubble.props" />
    <EventsTable :rows="meta.KunChatBubble.events" />
    <SlotsTable :rows="meta.KunChatBubble.slots" />
  </article>
</template>
