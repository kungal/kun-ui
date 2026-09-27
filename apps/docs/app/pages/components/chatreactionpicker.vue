<script setup lang="ts">
import Basic from '~/examples/chatreactionpicker/Basic.vue'
import BasicSrc from '~/examples/chatreactionpicker/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      和 <code>KunReaction</code> 不同:那是一个点赞开关,这是一套词表里选一个。方向键在网格里移动。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatReactionPicker.props" />
    <EventsTable :rows="meta.KunChatReactionPicker.events" />
    <SlotsTable :rows="meta.KunChatReactionPicker.slots" />
  </article>
</template>
