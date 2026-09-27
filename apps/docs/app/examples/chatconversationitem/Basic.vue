<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { DEMO_TZ, ME, demoMessage, demoPhoto, demoTime, demoUsers } from '~/utils/chatDemo'

// Every state a row has, in one list. The preview line shows, by precedence,
// who is typing, then the draft, then the last message.
const [haru, ayase, luna, gone] = [demoUsers[1]!, demoUsers[2]!, demoUsers[3]!, demoUsers[4]!]
const last = {
  haru: demoMessage(haru.id, demoTime(0, '09:14'), `对了,[@鲲](mention:${ME}) 周末的线下聚会你去吗?`),
  ayase: demoMessage(ME, demoTime(0, '08:02'), '存档我发你了'),
  luna: demoMessage(luna.id, demoTime(0, '07:40'), '', { media: demoPhoto('bg/bg4', 1920, 1200) }),
  group: demoMessage(luna.id, demoTime(3, '19:12'), '有兴趣帮忙校对的私聊我'),
  gone: demoMessage(ME, demoTime(40, '12:00'), '谢谢你的补丁!'),
}
const selected = ref('haru')
const typing = ref<KunChatTypingEvent[]>([])
let timer: ReturnType<typeof setInterval> | undefined
// A typing notification lapses after 6 s; renew it every 5 s, as a client does.
onMounted(() => {
  typing.value = [{ user_id: ayase.id, at: Date.now() }]
  timer = setInterval(() => (typing.value = [{ user_id: ayase.id, at: Date.now() }]), 5000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-md flex-col gap-0.5 rounded-kun-lg border p-1.5">
    <KunChatConversationItem
      :user="haru"
      :last-message="last.haru"
      :unread-count="3"
      :mention-count="1"
      :selected="selected === 'haru'"
      :time-zone="DEMO_TZ"
      @click="selected = 'haru'"
    />
    <KunChatConversationItem
      :user="ayase"
      :last-message="last.ayase"
      last-message-sender="你"
      status="read"
      :typing="typing"
      pinned
      :selected="selected === 'ayase'"
      :time-zone="DEMO_TZ"
      @click="selected = 'ayase'"
    />
    <KunChatConversationItem
      :user="luna"
      :last-message="last.luna"
      :draft="{ text: '第三章的校对我明天', entities: [] }"
      :selected="selected === 'luna'"
      :time-zone="DEMO_TZ"
      @click="selected = 'luna'"
    />
    <KunChatConversationItem
      title="Galgame 汉化交流 · 校对组"
      kind="group"
      :avatar="luna.avatar"
      :last-message="last.group"
      last-message-sender="樱小路露娜"
      :unread-count="128"
      muted
      :selected="selected === 'group'"
      :time-zone="DEMO_TZ"
      @click="selected = 'group'"
    />
    <KunChatConversationItem
      :user="gone"
      :last-message="last.gone"
      last-message-sender="你"
      status="sent"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
