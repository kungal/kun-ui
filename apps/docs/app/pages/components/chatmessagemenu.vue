<script setup lang="ts">
import Basic from '~/examples/chatmessagemenu/Basic.vue'
import BasicSrc from '~/examples/chatmessagemenu/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      快捷回应一排最多 7 个,更多的由右侧按钮展开成完整的选择器;↑↓ 在操作之间移动,←→ 在回应之间移动,
      Tab 在两组之间切换,Esc 关闭。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatMessageMenu.props" />
    <EventsTable :rows="meta.KunChatMessageMenu.events" />
    <SlotsTable :rows="meta.KunChatMessageMenu.slots" />
  </article>
</template>
