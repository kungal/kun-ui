<script setup lang="ts">
import Basic from '~/examples/chattyping/Basic.vue'
import BasicSrc from '~/examples/chattyping/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      群聊里显示名字(一人、两三人、「某某 等 N 人」),私聊只说「正在输入…」。
      <code>useKunChatTyping</code> 是同一套逻辑的组合式,自定义的地方用得上。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatTyping.props" />
    <EventsTable :rows="meta.KunChatTyping.events" />
    <SlotsTable :rows="meta.KunChatTyping.slots" />
  </article>
</template>
