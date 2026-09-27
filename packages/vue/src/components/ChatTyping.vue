<script setup lang="ts">
import { useKunChatTyping } from '../composables/useKunChatTyping'
import type { KunChatTypingProps } from './types'

// "… is typing" with three bouncing dots, in the surrounding text colour —
// KunChatHeader and KunChatConversationItem paint it in the accent, as
// Telegram does. Renders nothing while nobody is typing; each notification
// lapses 6 s after it arrived, so the site only forwards what it receives.
defineOptions({ name: 'KunChatTyping' })

const props = withDefaults(defineProps<KunChatTypingProps>(), {
  events: () => [],
  users: () => [],
  kind: 'direct',
  showText: true,
})

const { active, label } = useKunChatTyping(() => ({
  events: props.events,
  users: props.users,
  kind: props.kind,
}))
</script>

<template>
  <span v-if="active" class="kun-chat-typing inline-flex min-w-0 items-center gap-1.5">
    <span class="kun-chat-typing-dots inline-flex shrink-0 items-center" aria-hidden="true">
      <span /><span /><span />
    </span>
    <span v-if="showText" class="truncate">{{ label }}</span>
    <span v-else class="sr-only">{{ label }}</span>
  </span>
</template>

<style scoped>
.kun-chat-typing-dots {
  gap: 3px;
  height: 1em;
}
.kun-chat-typing-dots span {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: currentColor;
  animation: kun-chat-typing 1.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
.kun-chat-typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.kun-chat-typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}
/* A small hop and settle, transform and opacity only. */
@keyframes kun-chat-typing {
  0%,
  55%,
  100% {
    transform: translateY(0) scale(0.75);
    opacity: 0.45;
  }
  25% {
    transform: translateY(-2.5px) scale(1);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kun-chat-typing-dots span {
    animation: none;
    opacity: 0.7;
  }
}
</style>
