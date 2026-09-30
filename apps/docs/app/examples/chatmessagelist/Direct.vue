<script setup lang="ts">
import { ref } from 'vue'
import {
  DEMO_TZ,
  ME,
  demoReactions,
  demoUsers,
  makeDirectConversation,
} from '~/utils/chatDemo'

// A direct chat opened with unread messages: it opens at the "unread" divider,
// and `read` reports how far you have actually seen. Right-click (or long-press)
// a message for the menu; photos open in one lightbox for the whole chat.
const messages = ref(makeDirectConversation())
const readUpTo = ref(16)
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <KunChatMessageList
      class="bg-default-100 flex-1"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :last-read-seq="16"
      :peer-read-seq="14"
      :reaction-options="demoReactions"
      :time-zone="DEMO_TZ"
      @read="(seq) => (readUpTo = seq)"
    />
    <p class="text-foreground-muted border-default/20 border-t px-3 py-1.5 text-xs">
      已读到 seq {{ readUpTo }}
    </p>
  </div>
</template>
