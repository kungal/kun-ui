<script setup lang="ts">
import Basic from '~/examples/chatcomposer/Basic.vue'
import BasicSrc from '~/examples/chatcomposer/Basic.vue?raw'
import ReplyEdit from '~/examples/chatcomposer/ReplyEdit.vue'
import ReplyEditSrc from '~/examples/chatcomposer/ReplyEdit.vue?raw'
import Attachments from '~/examples/chatcomposer/Attachments.vue'
import AttachmentsSrc from '~/examples/chatcomposer/Attachments.vue?raw'
import Limit from '~/examples/chatcomposer/Limit.vue'
import LimitSrc from '~/examples/chatcomposer/Limit.vue?raw'
import Disabled from '~/examples/chatcomposer/Disabled.vue'
import DisabledSrc from '~/examples/chatcomposer/Disabled.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      草稿按 API 的形状存成 <code>parseKunChatMarkdown(草稿)</code>,即 <code>{ text, entities }</code>,
      恢复时用 <code>formatKunChatMarkdown</code> 写回输入框——App 端不需要懂 markdown。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">回复、引用与编辑</h2>
    <Demo title="ReplyEdit.vue" :source="ReplyEditSrc"><ReplyEdit /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">图片附件</h2>
    <Demo title="Attachments.vue" :source="AttachmentsSrc"><Attachments /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">长度上限</h2>
    <Demo title="Limit.vue" :source="LimitSrc"><Limit /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不可发送</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatComposer.props" />
    <EventsTable :rows="meta.KunChatComposer.events" />
    <SlotsTable :rows="meta.KunChatComposer.slots" />
  </article>
</template>
