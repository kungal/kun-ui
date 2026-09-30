<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, ME, demoMessage, demoReplyTo, demoTime, demoUsers } from '~/utils/chatDemo'

// The server embeds `reply_to` (the replied-to message's first 120 characters)
// and, for a partial quote, `reply_quote`. Clicking the preview emits
// `reply-click` with the seq — the list scrolls there.
const original = demoMessage('1002', demoTime(0, '10:35'), '最后那个反转你猜到了吗?原来||列车长就是白本人||')
const reply = demoMessage(ME, demoTime(0, '10:41'), '猜到一半,第三章那封信就有暗示了', {
  reply_to: demoReplyTo(original),
})
const quote = demoMessage(ME, demoTime(0, '10:42'), '这句我也没想到', {
  reply_to: demoReplyTo(original),
  reply_quote: { text: '列车长就是白本人', entities: [], offset: 14 },
})
const gone = demoMessage('1002', demoTime(0, '10:50'), '那条我删了哈哈', {
  reply_to: { ...demoReplyTo(original), text: '', entities: [], deleted: true },
})
const clicked = ref<number | null>(null)
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-1.5 rounded-kun-lg p-3">
    <KunChatBubble :message="original" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble class="self-end" :message="reply" :users="demoUsers" own status="read" :time-zone="DEMO_TZ" @reply-click="(s) => (clicked = s)" />
    <KunChatBubble class="self-end" :message="quote" :users="demoUsers" own status="read" :time-zone="DEMO_TZ" @reply-click="(s) => (clicked = s)" />
    <KunChatBubble :message="gone" :users="demoUsers" :time-zone="DEMO_TZ" />
    <code v-if="clicked" class="text-foreground-muted text-xs">reply-click → seq {{ clicked }}</code>
  </div>
</template>
