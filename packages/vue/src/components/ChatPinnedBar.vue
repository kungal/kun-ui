<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn, type KunChatMessage } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import KunChatText from './ChatText.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { kunChatMediaLabel } from '../utils/chat'
import type { KunChatPinnedBarProps } from './types'

// The pinned message on top of a conversation. With several, it starts at
// the newest; a click jumps to the one shown and moves the bar to the next
// older one, wrapping around — Telegram's behaviour. The segments on the left
// show where in the stack it is.
defineOptions({ name: 'KunChatPinnedBar' })

const props = withDefaults(defineProps<KunChatPinnedBarProps>(), {
  resolveMediaUrl: undefined,
  unpinnable: false,
})

const emit = defineEmits<{
  /** Scroll the conversation to this message (`scrollToSeq`). */
  jump: [seq: number]
  /** The × was clicked for the message shown. */
  unpin: [seq: number]
}>()

defineSlots<{
  /** Extra buttons on the right, e.g. "all pinned messages". */
  actions?: () => unknown
}>()

const { t } = useKunLocale()

const stack = computed<KunChatMessage[]>(() => [...props.messages].sort((a, b) => b.seq - a.seq))
const index = ref(0)
watch(
  () => stack.value.length,
  (n) => {
    if (index.value >= n) index.value = 0
  }
)
const current = computed(() => stack.value[index.value] ?? null)

const onClick = () => {
  const message = current.value
  if (!message) return
  emit('jump', message.seq)
  if (stack.value.length > 1) index.value = (index.value + 1) % stack.value.length
}

// At most four segments, sliding with the position, as in Telegram.
const SEGMENTS = 4
const segments = computed(() => {
  const n = stack.value.length
  if (n <= 1) return []
  const count = Math.min(n, SEGMENTS)
  // Oldest at the top: the newest is the bottom segment.
  const position = n - 1 - index.value
  const first = Math.min(Math.max(0, position - (count - 1)), n - count)
  return Array.from({ length: count }, (_, i) => first + i === position)
})

const thumb = computed(() => {
  const media = current.value?.media
  if (media?.type !== 'photo') return null
  return props.resolveMediaUrl?.(media, 'preview') ?? media.url ?? null
})
const title = computed(() =>
  stack.value.length > 1
    ? t('chatPinned.indexed', { index: stack.value.length - index.value })
    : t('chatPinned.label')
)
</script>

<template>
  <div
    v-if="current"
    class="kun-chat-pinned-bar bg-content1 border-default/20 flex h-12 shrink-0 items-center gap-1 border-b pr-1"
  >
    <button
      type="button"
      class="flex h-full min-w-0 flex-1 items-center gap-2.5 pl-3 text-left transition-colors hover:bg-default/10"
      @click="onClick"
    >
      <span v-if="segments.length" class="flex h-8 w-0.5 shrink-0 flex-col gap-0.5" aria-hidden="true">
        <span
          v-for="(on, i) in segments"
          :key="i"
          :class="cn('flex-1 rounded-full', on ? 'bg-primary' : 'bg-primary/30')"
        />
      </span>
      <span v-else class="bg-primary h-8 w-0.5 shrink-0 rounded-full" aria-hidden="true" />
      <img
        v-if="thumb"
        :src="thumb"
        alt=""
        class="size-8 shrink-0 rounded-kun-sm object-cover"
        loading="lazy"
        decoding="async"
      />
      <span class="flex min-w-0 flex-col">
        <span class="text-primary truncate text-sm font-semibold">{{ title }}</span>
        <span class="text-default-600 truncate text-sm [:where(&)_*]:text-inherit">
          <KunChatText v-if="current.text" :text="current.text" :entities="current.entities" preview />
          <span v-else>{{ kunChatMediaLabel(current.media, t) }}</span>
        </span>
      </span>
    </button>
    <slot name="actions" />
    <button
      v-if="unpinnable"
      type="button"
      class="text-default-500 hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-default/20"
      :aria-label="t('chatPinned.unpin')"
      @click="emit('unpin', current.seq)"
    >
      <KunIcon name="lucide:x" />
    </button>
  </div>
</template>
