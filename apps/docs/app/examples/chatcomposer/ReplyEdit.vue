<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatFormattedText, KunChatMessage, KunChatReplyQuote } from '@kungal/ui-vue'
import { ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// `reply-to`, `quote` and `editing` are v-models the message menu sets. While
// editing, the message comes back into the input in the shortcut syntax
// (formatKunChatMarkdown) and the unsent draft waits aside; Esc or × cancels,
// ↑ in an empty input asks to edit your last message.
const hers = demoMessage('1002', demoTime(0, '10:35'), '最后那个反转你猜到了吗?原来||列车长就是白本人||')
const mine = demoMessage(ME, demoTime(0, '10:42'), '不过前作的__系统__有点老,存档记得**多开几个位**')
const draft = ref('这是还没发出去的草稿')
const replyTo = ref<KunChatMessage | null>(null)
const quote = ref<KunChatReplyQuote | null>(null)
const editing = ref<KunChatMessage | null>(null)
const log = ref('')
const onSend = (m: KunChatFormattedText) => (log.value = `send:${m.text}`)
const onEdit = (m: KunChatFormattedText) => (log.value = `edit:${m.text}`)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <div class="flex flex-wrap gap-2 p-3">
      <KunButton size="sm" variant="flat" @click="(replyTo = hers), (quote = null)">回复她</KunButton>
      <KunButton
        size="sm"
        variant="flat"
        @click="(replyTo = hers), (quote = { text: '列车长就是白本人', entities: [], offset: 14 })"
      >
        引用一段
      </KunButton>
      <KunButton size="sm" variant="flat" @click="editing = mine">编辑我的消息</KunButton>
      <span class="text-foreground-muted self-center text-xs">{{ log }}</span>
    </div>
    <KunChatComposer
      v-model="draft"
      v-model:reply-to="replyTo"
      v-model:quote="quote"
      v-model:editing="editing"
      :users="demoUsers"
      @send="onSend"
      @edit="onEdit"
      @edit-last="editing = mine"
    />
  </div>
</template>
