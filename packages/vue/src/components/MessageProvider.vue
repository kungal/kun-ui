<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

// Toasts are client-only, ephemeral UI. Render nothing until mounted so the
// server (and the first, pre-hydration client render) emits no toast markup —
// no hydration mismatch even if the store were somehow non-empty on the server.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

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

// The centred placements carry no horizontal anchor here — they get `left` and
// their half-width shift from positionStyles below.
const positionClasses: Record<KunMessagePosition, string> = {
  'top-center': 'top-4 items-center',
  'top-left': 'top-4 left-4 items-start',
  'top-right': 'top-4 right-4 items-end',
  'bottom-center': 'bottom-4 items-center',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
}

// This container is `position: fixed`, so its containing block is the initial
// containing block — which GROWS by the scrollbar width when an overlay hides
// it. Body padding cannot reach it (that only compensates in-flow content), so
// a visible toast slides sideways the moment a Modal opens: measured on the
// docs site, a `top-right` toast went from right=1458.4 to right=1473.6 when
// KunCommandPalette opened. useBodyScrollLock publishes the width it removed;
// each placement takes back the part that moves it — all of it when anchored to
// the right edge, half when centred against `left: 50%` of a wider ICB, none
// when anchored left. The published width is 0 whenever nothing was removed
// (overlay scrollbars, or a page reserving its own gutter), so this costs
// nothing there.
//
// The compensation is a MARGIN, never the anchor itself. A declaration
// containing var() is only validated after substitution, so a consumer who sets
// the variable to a bare `16` makes it invalid at computed-value time: as
// `margin-left` that falls back to `0` and the toast merely stays uncompensated,
// but as part of `left` it would fall back to `auto`, dropping the container to
// its static position and dragging it half its own width off the screen. `left`
// and the half-width shift are inline too, so a consumer's Tailwind scan can
// never be what decides whether a toast lands on screen (iron rule 5).
const COMPENSATE = 'var(--kun-scrollbar-width, 0px)'
const CENTRED = {
  left: '50%',
  translate: '-50% 0',
  marginLeft: `calc(${COMPENSATE} / -2)`,
}
const positionStyles: Record<KunMessagePosition, Record<string, string>> = {
  'top-center': CENTRED,
  'top-left': {},
  'top-right': { marginRight: COMPENSATE },
  'bottom-center': CENTRED,
  'bottom-left': {},
  'bottom-right': { marginRight: COMPENSATE },
}
</script>

<template>
  <Teleport to="body">
    <!-- Client-only (`v-if="mounted"`) so no toast markup is ever
         server-rendered — the module store is shared across SSR requests. -->
    <template v-if="mounted">
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
        :style="positionStyles[position as KunMessagePosition]"
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
    </template>
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
