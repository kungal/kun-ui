<script setup lang="ts">
import Basic from '~/examples/chatconversationitem/Basic.vue'
import BasicSrc from '~/examples/chatconversationitem/Basic.vue?raw'
import Swipe from '~/examples/chatconversationitem/Swipe.vue'
import SwipeSrc from '~/examples/chatconversationitem/Swipe.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">各种状态</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      未读与 @ 角标、静音置灰、置顶图钉、「正在输入…」、草稿、最后一条是自己发的(带送达状态)、
      已注销的对方、选中态。传 <code>href</code> 时整行是链接,否则是按钮。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">滑动操作</h2>
    <Demo title="Swipe.vue" :source="SwipeSrc"><Swipe /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatConversationItem.props" />
    <EventsTable :rows="meta.KunChatConversationItem.events" />
    <SlotsTable :rows="meta.KunChatConversationItem.slots" />
  </article>
</template>
