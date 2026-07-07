<script setup lang="ts">
import { computed } from 'vue'
import {
  useKunMessageState,
  type KunMessagePosition,
  type KunMessageOptions,
} from '../composables/useKunMessage'
import KunMessageItem from './MessageItem.vue'

// The single mounted container for KunUI toasts. Mount it ONCE near your app
// root (e.g. in App.vue / the default layout):
//
//   <KunMessageProvider />
//
// It reads the module-scope message store and renders each toast. Unlike the
// original (which was render()-ed into a detached node with a stolen Nuxt
// app context), this is a real component in your tree, so KunIcon/theme work
// with no context hack. It Teleports to <body> so a parent's transform /
// overflow / z-index can't clip or mis-position the toasts.
defineOptions({ name: 'KunMessageProvider' })

const { messages, removeMessage } = useKunMessageState()

const positionedMessages = computed(() => {
  const groups: Record<KunMessagePosition, KunMessageOptions[]> = {
    'top-left': [],
    'top-center': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-center': [],
    'bottom-right': [],
  }
  messages.value.forEach((msg) => {
    if (groups[msg.position]) groups[msg.position]!.push(msg)
  })
  return groups
})

const positionClasses: Record<KunMessagePosition, string> = {
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-left': 'top-4 left-4 items-start',
  'top-right': 'top-4 right-4 items-end',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
}
</script>

<template>
  <Teleport to="body">
    <!-- Plain positioning container — live-region semantics live on each
         KunMessageItem (status/polite, or alert/assertive for error/warn).
         `data-kun-overlay` keeps toasts interactive above an open Modal/Drawer
         (which marks the rest of the page inert). -->
    <div
      v-for="(msgs, position) in positionedMessages"
      :key="position"
      data-kun-overlay
      :class="[
        'pointer-events-none fixed z-kun-message flex w-full max-w-sm flex-col p-4',
        positionClasses[position as KunMessagePosition],
      ]"
    >
      <!-- `relative` makes THIS wrapper the containing block for a leaving item
           (which goes `position: absolute`). Without it, the item's `width: 100%`
           resolves against the outer `fixed` container's padding box — 2rem wider
           than the in-flow width — so the toast visibly jumps wider (spilling out
           the right) for a frame before it fades. -->
      <TransitionGroup name="message-list" tag="div" class="relative w-full">
        <KunMessageItem
          v-for="msg in msgs"
          :key="msg.id"
          v-bind="msg"
          class="pointer-events-auto"
          @remove="removeMessage"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.message-list-move {
  transition: transform var(--kun-dur-base) var(--ease-kun-emphasized);
}

.message-list-enter-active {
  transition:
    opacity var(--kun-dur-slow) var(--ease-kun-out),
    transform var(--kun-dur-slow) var(--ease-kun-out);
}

.message-list-leave-active {
  transition:
    opacity var(--kun-dur-base) var(--ease-kun-in),
    transform var(--kun-dur-base) var(--ease-kun-in);

  position: absolute;
  width: 100%;
}

.message-list-enter-from,
.message-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

[class*='top-'] .message-list-enter-from,
[class*='top-'] .message-list-leave-to {
  transform: translateY(-30px) scale(0.8);
}

[class*='bottom-'] .message-list-enter-from,
[class*='bottom-'] .message-list-leave-to {
  transform: translateY(30px) scale(0.8);
}
</style>
