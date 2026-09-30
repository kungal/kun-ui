<script setup lang="ts">
import KunSplitPane from './SplitPane.vue'
import type { KunChatLayoutProps } from './types'

// Two panes — conversation list beside the open conversation — when the layout
// itself is at least 48rem wide, and one at a time below that, switched by
// `showConversation`, the way the apps behave. A container query, not `md:`: a
// chat beside a kungal app's side rail took two panes at a 768 window with 679
// to fill and left the conversation 327 wide. Pure CSS either way, so which
// pane a phone sees is decided by a prop the server knows.
defineOptions({ name: 'KunChatLayout' })

withDefaults(defineProps<KunChatLayoutProps>(), {
  showConversation: false,
  sidebarWidth: '22rem',
  resizable: false,
  sidebarMinSize: 280,
  sidebarMaxSize: 480,
})

/** Width of the list pane in px while `resizable`; persist it from
 *  `sidebar-resize-end`. */
const sidebarSize = defineModel<number>('sidebarSize', { default: 352 })

const emit = defineEmits<{
  /** A drag or a key press on the divider finished with this list width. */
  'sidebar-resize-end': [size: number]
}>()

defineSlots<{
  /** The conversation list. */
  sidebar?: () => unknown
  /** The open conversation. */
  default?: () => unknown
  /** What the right pane shows with no conversation open, in the two-pane layout. */
  empty?: () => unknown
}>()
</script>

<template>
  <div
    class="kun-chat-layout h-full min-h-0 w-full overflow-hidden"
    :style="{ containerType: 'inline-size', containerName: 'kun-chat' }"
  >
    <KunSplitPane
      v-if="resizable"
      v-model:size="sidebarSize"
      :min-size="sidebarMinSize"
      :max-size="sidebarMaxSize"
      stack-below="md"
      :show-pane="showConversation ? 'end' : 'start'"
      @resize-end="(size: number) => emit('sidebar-resize-end', size)"
    >
      <template #start><slot name="sidebar" /></template>
      <template #end>
        <slot v-if="showConversation" />
        <slot v-else name="empty" />
      </template>
    </KunSplitPane>
    <div
      v-else
      class="kun-chat-layout__panes"
      :data-show="showConversation ? 'conversation' : 'sidebar'"
    >
      <aside class="kun-chat-layout__sidebar border-default/20" :style="{ '--kun-chat-sidebar': sidebarWidth }">
        <slot name="sidebar" />
      </aside>
      <div class="kun-chat-layout__main">
        <slot v-if="showConversation" />
        <slot v-else name="empty" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.kun-chat-layout__panes {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.kun-chat-layout__sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 0;
  width: var(--kun-chat-sidebar);
  border-right-width: 1px;
}
.kun-chat-layout__main {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
@container kun-chat (width < 48rem) {
  .kun-chat-layout__sidebar {
    width: 100%;
    border-right-width: 0;
  }
  .kun-chat-layout__panes[data-show='conversation'] > .kun-chat-layout__sidebar,
  .kun-chat-layout__panes[data-show='sidebar'] > .kun-chat-layout__main {
    display: none;
  }
}
</style>
