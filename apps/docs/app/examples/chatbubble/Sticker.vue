<script setup lang="ts">
import { DEMO_TZ, ME, demoMessage, demoReactions, demoReplyTo, demoSticker, demoTime, demoUsers } from '~/utils/chatDemo'

// A sticker has no bubble: it is drawn at a fixed size (its long side 160 px),
// with the time on its corner and reactions below. Sender name and reply
// preview sit on a small card of their own above it. A reply to a sticker
// reads "贴纸". Stickers never join an album and never open the lightbox.
const question = demoMessage('1002', demoTime(0, '21:02'), '通宵推完了?')
const sticker = demoMessage(ME, demoTime(0, '21:03'), '', {
  media: demoSticker('knife'),
  reply_to: demoReplyTo(question),
})
const answer = demoMessage('1003', demoTime(0, '21:04'), '', {
  media: demoSticker('pout'),
  reactions: [
    { reaction: 'sob', count: 2, reacted: false },
    { reaction: 'heart', count: 1, reacted: true },
  ],
})
const replyToSticker = demoMessage('1002', demoTime(0, '21:05'), '这个表情包哪里来的,我也要', {
  reply_to: demoReplyTo(answer),
})
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-1.5 rounded-kun-lg p-3">
    <KunChatBubble :message="question" :users="demoUsers" :time-zone="DEMO_TZ" />
    <KunChatBubble class="self-end" :message="sticker" :users="demoUsers" own status="read" :time-zone="DEMO_TZ" />
    <KunChatBubble :message="answer" :users="demoUsers" :reaction-options="demoReactions" show-sender :time-zone="DEMO_TZ" />
    <KunChatBubble :message="replyToSticker" :users="demoUsers" :time-zone="DEMO_TZ" />
  </div>
</template>
