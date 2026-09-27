<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import type { KunChatLayoutProps } from './types'

// Two panes from `md` up — conversation list beside the open conversation —
// and one at a time below it, switched by `showConversation`, the way the
// apps behave. Pure breakpoint classes: which pane a phone sees is decided by
// a prop the server knows, never by a JS media query that SSR would guess.
defineOptions({ name: 'KunChatLayout' })

withDefaults(defineProps<KunChatLayoutProps>(), {
  showConversation: false,
  sidebarWidth: '22rem',
})

defineSlots<{
  /** The conversation list. */
  sidebar?: () => unknown
  /** The open conversation. */
  default?: () => unknown
  /** What the right pane shows with no conversation open, from `md` up. */
  empty?: () => unknown
}>()
</script>

<template>
  <div class="kun-chat-layout flex h-full min-h-0 w-full overflow-hidden">
    <aside
      :class="
        cn(
          'border-default/20 min-h-0 w-full flex-col md:flex md:w-(--kun-chat-sidebar) md:shrink-0 md:border-r',
          showConversation ? 'hidden' : 'flex'
        )
      "
      :style="{ '--kun-chat-sidebar': sidebarWidth }"
    >
      <slot name="sidebar" />
    </aside>
    <div :class="cn('min-h-0 min-w-0 flex-1 flex-col md:flex', showConversation ? 'flex' : 'hidden')">
      <slot v-if="showConversation" />
      <slot v-else name="empty" />
    </div>
  </div>
</template>
