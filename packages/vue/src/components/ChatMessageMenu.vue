<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn, kunVariantClasses, type KunUIColor } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import KunChatReactionPicker from './ChatReactionPicker.vue'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { useKunLocale } from '../locale/useKunLocale'
import type {
  KunChatMessageAction,
  KunChatMessageActionKey,
  KunChatMessageMenuItem,
  KunChatMessageMenuProps,
} from './types'

// The long-press / right-click menu of a message: a row of quick reactions on
// top (Telegram shows seven, then a button that opens them all), the actions
// below. Positioned at a point and kept inside the viewport, with the same
// keyboard model as KunContextMenu — plus ←/→ along the reaction row.
defineOptions({ name: 'KunChatMessageMenu' })

const props = withDefaults(defineProps<KunChatMessageMenuProps>(), {
  position: () => ({ x: 0, y: 0 }),
  actions: () => ['reply', 'copy'],
  reactions: () => [],
  currentReaction: null,
  quickReactions: 7,
})

const emit = defineEmits<{
  /** An action was chosen: a built-in key or one of your own items' keys. */
  select: [action: string]
  /** A reaction was chosen: its key, or null when the current one was chosen
   *  again. */
  react: [reaction: string | null]
  /** The menu closed, for any reason. */
  close: []
}>()

const { t } = useKunLocale()
const menuRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(menuRef)
const expanded = ref(false)
const pos = ref({ x: 0, y: 0 })
let lastFocused: HTMLElement | null = null

const BUILT_IN: Record<KunChatMessageActionKey, { icon: string; color?: KunUIColor }> = {
  reply: { icon: 'lucide:reply' },
  quote: { icon: 'lucide:quote' },
  copy: { icon: 'lucide:copy' },
  edit: { icon: 'lucide:pencil' },
  pin: { icon: 'lucide:pin' },
  unpin: { icon: 'lucide:pin-off' },
  retry: { icon: 'lucide:rotate-cw' },
  delete: { icon: 'lucide:trash-2', color: 'danger' },
  report: { icon: 'lucide:flag', color: 'danger' },
}

const items = computed<KunChatMessageMenuItem[]>(() =>
  props.actions.map((a: KunChatMessageAction) =>
    typeof a === 'string'
      ? { key: a, label: t(`chatMenu.${a}`), icon: BUILT_IN[a].icon, color: BUILT_IN[a].color }
      : a
  )
)
const quick = computed(() => props.reactions.slice(0, props.quickReactions))
const hasMore = computed(() => props.reactions.length > props.quickReactions)

const menuItems = () =>
  Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
const reactionButtons = () =>
  Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[data-kun-quick]') ?? [])

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max))
const place = async () => {
  await nextTick()
  const el = menuRef.value
  if (!el || typeof window === 'undefined') return
  const pad = 8
  pos.value = {
    x: clamp(props.position?.x ?? 0, pad, window.innerWidth - el.offsetWidth - pad),
    y: clamp(props.position?.y ?? 0, pad, window.innerHeight - el.offsetHeight - pad),
  }
}

const close = (returnFocus = false) => {
  emit('close')
  if (returnFocus) nextTick(() => lastFocused?.focus({ preventScroll: true }))
}

watch(
  () => [props.visible, props.position?.x, props.position?.y],
  async () => {
    if (!props.visible) {
      expanded.value = false
      return
    }
    pos.value = { x: props.position?.x ?? 0, y: props.position?.y ?? 0 }
    await place()
    if (typeof document === 'undefined') return
    lastFocused = (document.activeElement as HTMLElement) ?? null
    ;(menuItems()[0] ?? reactionButtons()[0] ?? menuRef.value)?.focus({ preventScroll: true })
  },
  { immediate: true }
)
const picker = ref<{ focus: () => void } | null>(null)
// The expand button is gone once the picker replaces the row, so focus has to
// move into the picker or it drops to <body>.
watch(expanded, async (open) => {
  if (!props.visible) return
  await place()
  if (open) picker.value?.focus()
})

const onOutside = (event: Event) => {
  if (props.visible && menuRef.value && !menuRef.value.contains(event.target as Node)) close()
}
// The reader scrolling closes the menu; its own picker scrolling, or a
// message list correcting for a new message (it marks itself
// `data-kun-adjusting`; nothing moves on screen), does not.
const onScroll = (event: Event) => {
  const target = event.target
  if (!props.visible) return
  if (target instanceof Element) {
    if (menuRef.value?.contains(target) || target.hasAttribute('data-kun-adjusting')) return
  }
  close()
}
const onResize = () => props.visible && close()
const onGlobalKey = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') close(true)
}
onMounted(() => {
  window.addEventListener('pointerdown', onOutside, true)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onGlobalKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onOutside, true)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onGlobalKey)
})

const select = (item: KunChatMessageMenuItem) => {
  if (item.disabled) return
  emit('select', item.key)
  close(true)
}
const react = (key: string | null) => {
  emit('react', key)
  close(true)
}
const toggleReaction = (key: string) => react(props.currentReaction === key ? null : key)

const moveFocus = (list: HTMLElement[], delta: number) => {
  if (!list.length) return
  const i = list.indexOf(document.activeElement as HTMLElement)
  list[(i + delta + list.length) % list.length]?.focus({ preventScroll: true })
}

const onKeydown = (event: KeyboardEvent) => {
  const inRow = (event.target as HTMLElement).hasAttribute('data-kun-quick')
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      if (expanded.value && !(event.target as HTMLElement).closest('[role="menu"]')) return
      event.preventDefault()
      const list = menuItems()
      if (inRow) list[event.key === 'ArrowDown' ? 0 : list.length - 1]?.focus()
      else moveFocus(list, event.key === 'ArrowDown' ? 1 : -1)
      break
    }
    case 'Home':
    case 'End': {
      if (expanded.value && !(event.target as HTMLElement).closest('[role="menu"]')) return
      event.preventDefault()
      const list = inRow ? reactionButtons() : menuItems()
      list[event.key === 'Home' ? 0 : list.length - 1]?.focus({ preventScroll: true })
      break
    }
    case 'ArrowLeft':
    case 'ArrowRight':
      if (!inRow) return
      event.preventDefault()
      moveFocus(reactionButtons(), event.key === 'ArrowRight' ? 1 : -1)
      break
    case 'Escape':
      event.preventDefault()
      close(true)
      break
    case 'Tab': {
      // Tab moves between the reaction row and the actions; with only one of
      // them it leaves, and leaving closes the menu, as in KunContextMenu.
      event.preventDefault()
      const row = reactionButtons()[0]
      const first = menuItems()[0]
      if (row && first) (inRow ? first : row).focus({ preventScroll: true })
      else close(true)
      break
    }
  }
}

const focusTint: Record<KunUIColor, string> = {
  default: 'focus:bg-default/20',
  primary: 'focus:bg-primary/20',
  secondary: 'focus:bg-secondary/20',
  success: 'focus:bg-success/20',
  warning: 'focus:bg-warning/20',
  danger: 'focus:bg-danger/20',
  info: 'focus:bg-info/20',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-kun-base ease-kun-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-kun-exit ease-kun-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible && (items.length || reactions.length)"
        ref="menuRef"
        data-kun-overlay
        tabindex="-1"
        :aria-label="t('chatMenu.label')"
        class="bg-content1 fixed z-kun-popover min-w-52 rounded-kun-lg p-1 text-sm shadow-kun-md outline-none"
        :style="{ top: `${pos.y}px`, left: `${pos.x}px`, transformOrigin: 'top left' }"
        @keydown="onKeydown"
        @contextmenu.prevent
      >
        <div
          v-if="reactions.length && !expanded"
          class="border-default/20 mb-1 flex items-center gap-0.5 border-b px-0.5 pb-1"
          role="group"
          :aria-label="t('chat.reactions')"
        >
          <button
            v-for="(r, i) in quick"
            :key="r.key"
            type="button"
            data-kun-quick
            :tabindex="i === 0 ? 0 : -1"
            :aria-label="r.label"
            :aria-pressed="currentReaction === r.key"
            :title="r.label"
            :class="
              cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full text-xl leading-none transition-transform outline-none hover:scale-110 focus-visible:bg-default/20',
                currentReaction === r.key && 'bg-primary/20'
              )
            "
            @click="toggleReaction(r.key)"
          >
            <img v-if="r.image_url" :src="r.image_url" alt="" class="size-7 object-contain" decoding="async" />
            <span v-else aria-hidden="true">{{ r.emoji }}</span>
          </button>
          <button
            v-if="hasMore"
            type="button"
            data-kun-quick
            tabindex="-1"
            :aria-label="t('chatMenu.moreReactions')"
            class="text-default-500 hover:text-foreground ml-auto flex size-8 shrink-0 items-center justify-center rounded-full outline-none focus-visible:bg-default/20 hover:bg-default/20"
            @click="expanded = true"
          >
            <KunIcon name="lucide:chevron-down" />
          </button>
        </div>

        <div v-if="expanded" class="max-h-72 w-76 max-w-[calc(100vw-2rem)] overflow-y-auto p-1">
          <KunChatReactionPicker
            ref="picker"
            :model-value="currentReaction"
            :options="reactions"
            :columns="7"
            @select="react"
          />
        </div>

        <div v-else role="menu" aria-orientation="vertical" class="flex flex-col">
          <button
            v-for="item in items"
            :key="item.key"
            type="button"
            role="menuitem"
            tabindex="-1"
            :aria-disabled="item.disabled || undefined"
            :class="
              cn(
                'relative flex w-full cursor-pointer items-center gap-2.5 rounded-kun-md px-3 py-1.5 text-left text-sm font-medium outline-none transition-colors',
                kunVariantClasses('light', item.color || 'default'),
                focusTint[item.color || 'default'],
                item.disabled && 'pointer-events-none opacity-50'
              )
            "
            @click="select(item)"
            @mouseenter="($event.currentTarget as HTMLElement).focus({ preventScroll: true })"
          >
            <KunIcon v-if="item.icon" :name="item.icon" class="shrink-0 text-base" />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
