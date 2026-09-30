<script setup lang="ts">
import Basic from '~/examples/chatpinnedbar/Basic.vue'
import BasicSrc from '~/examples/chatpinnedbar/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      把 <code>@jump</code> 接到 <code>KunChatMessageList</code> 的 <code>scrollToSeq</code>;
      没载入的消息 <code>scrollToSeq</code> 返回 false,按 <code>around_seq</code> 取一页再跳。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatPinnedBar.props" />
    <EventsTable :rows="meta.KunChatPinnedBar.events" />
    <SlotsTable :rows="meta.KunChatPinnedBar.slots" />
  </article>
</template>
