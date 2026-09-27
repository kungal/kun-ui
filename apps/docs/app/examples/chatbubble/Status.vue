<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatSendStatus } from '@kungal/ui-vue'
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// The delivery state of an own message is the site's to compute: a clock
// while sending, one tick once stored, two once the other side's read cursor
// has passed it. A failed message gets a button that emits `retry`.
const states: KunChatSendStatus[] = ['sending', 'sent', 'read', 'failed']
const texts = ['正在发送的消息', '已送达,对方还没看', '对方已读', '网络断了,没发出去']
const messages = states.map((s, i) => demoMessage(ME, demoTime(0, `22:0${i}`), texts[i]!))
const status = ref<KunChatSendStatus[]>([...states])
const retry = (i: number) => {
  status.value[i] = 'sending'
  setTimeout(() => (status.value[i] = 'sent'), 800)
}
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col items-end gap-1 rounded-kun-lg p-3 pl-12">
    <KunChatBubble
      v-for="(m, i) in messages"
      :key="m.id"
      :message="m"
      :users="demoUsers"
      own
      :status="status[i]"
      :time-zone="DEMO_TZ"
      @retry="retry(i)"
    />
  </div>
</template>
