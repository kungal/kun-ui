<script setup lang="ts">
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// A run of messages from one sender: `position` rounds the corners on the
// sender's side and puts the tail on the last one. Own messages sit right in
// the primary tint; the list does that alignment, here a flex column does.
const theirs = [
  demoMessage('1002', demoTime(0, '21:03'), '在吗在吗'),
  demoMessage('1002', demoTime(0, '21:03'), '你之前说的那个补丁我装上了'),
  demoMessage('1002', demoTime(0, '21:04'), '但是一进游戏就乱码,是不是要转区?'),
]
const mine = demoMessage(ME, demoTime(0, '21:07'), '对,用 Locale Emulator 转区再开就好了', {
  edited_at: demoTime(0, '21:08'),
})
const positions = ['first', 'middle', 'last'] as const
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-0.5 rounded-kun-lg p-3">
    <KunChatBubble
      v-for="(m, i) in theirs"
      :key="m.id"
      :message="m"
      :users="demoUsers"
      :position="positions[i]"
      :time-zone="DEMO_TZ"
    />
    <KunChatBubble
      class="mt-2 self-end"
      :message="mine"
      :users="demoUsers"
      own
      status="read"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
