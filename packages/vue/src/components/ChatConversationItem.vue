<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import { cn, kunSolidClasses } from '@kungal/ui-core'
import KunAvatar from './Avatar.vue'
import KunIcon from './Icon.vue'
import KunChatText from './ChatText.vue'
import KunChatTyping from './ChatTyping.vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { useKunLocale } from '../locale/useKunLocale'
import { useKunChatTyping } from '../composables/useKunChatTyping'
import {
  formatKunChatListTime,
  kunChatMediaLabel,
  kunChatServiceText,
  kunChatUserMap,
  resolveKunChatUser,
} from '../utils/chat'
import type { KunChatConversationItemProps, KunChatSwipeAction } from './types'

// One row of the conversation list: avatar, title, time, and a preview line
// that shows — in this order of precedence — who is typing, the draft, or the
// last message. On a touch screen the row slides to uncover its actions.
defineOptions({ name: 'KunChatConversationItem' })

const props = withDefaults(defineProps<KunChatConversationItemProps>(), {
  title: undefined,
  user: null,
  avatar: null,
  kind: 'direct',
  lastMessage: null,
  lastMessageSender: null,
  draft: null,
  typing: () => [],
  users: () => [],
  currentUserId: undefined,
  time: null,
  unreadCount: 0,
  markedUnread: false,
  mentionCount: 0,
  muted: false,
  pinned: false,
  status: undefined,
  selected: false,
  href: undefined,
  leadingActions: () => [],
  trailingActions: () => [],
  timeZone: undefined,
})

const emit = defineEmits<{
  /** The row was activated. With `href` it also navigates. */
  click: [event: MouseEvent]
  /** A swipe action was tapped. */
  action: [key: string]
}>()

const config = useKunUIConfig()
const { t, locale } = useKunLocale()

const resolved = computed(() =>
  props.user ? resolveKunChatUser(kunChatUserMap([props.user]), props.user.id, t) : null
)
const name = computed(() => props.title ?? resolved.value?.name ?? '')
const avatarUser = computed(() => ({
  id: 0,
  name: resolved.value?.deleted ? '' : name.value,
  avatar: props.avatar ?? resolved.value?.avatar ?? '',
}))

const { active: typingActive } = useKunChatTyping(() => ({
  events: props.typing,
  users: props.users,
  kind: props.kind,
}))

const time = computed(() => {
  const value = props.time ?? props.lastMessage?.created_at
  return value ? formatKunChatListTime(value, locale.code, props.timeZone) : ''
})
const draftText = computed(() => (props.draft?.text.trim() ? props.draft : null))
const serviceText = computed(() =>
  props.lastMessage?.kind === 'service'
    ? kunChatServiceText(props.lastMessage, {
        users: kunChatUserMap(props.users),
        currentUserId: props.currentUserId,
        t,
        locale: locale.code,
      })
    : ''
)

const statusIcon = computed(
  () =>
    ({ sending: 'lucide:clock', sent: 'lucide:check', read: 'lucide:check-check', failed: 'lucide:circle-alert' })[
      props.status ?? 'sent'
    ]
)
const badge = computed(() => (props.unreadCount > 999 ? '999+' : String(props.unreadCount)))

const rowBinding = computed(() => {
  if (!props.href) return { type: 'button' }
  return typeof config.linkComponent === 'string' ? { href: props.href } : { to: props.href }
})

// Each action is 72 px wide. Past half of the actions' width on release the
// row stays open; anything less springs back.
const ACTION_W = 72
const AXIS_LOCK = 12
const offset = ref(0)
const dragging = ref(false)
const leadingW = computed(() => props.leadingActions.length * ACTION_W)
const trailingW = computed(() => props.trailingActions.length * ACTION_W)

// `overflow: hidden` (which clips the swipe) makes the root a scroll container,
// and a flex item that is one gets an automatic min-height of 0 (CSS Flexbox
// §4.5). In a scrolling flex column the rows shrank instead of the list
// scrolling: moyu's 41 conversations came out 17px each. Inline, so a
// consumer's Tailwind cannot drop it.
const rootStyle = computed<CSSProperties>(() => ({
  flexShrink: 0,
  touchAction: leadingW.value || trailingW.value ? 'pan-y' : undefined,
}))
let press: { id: number; x: number; y: number; base: number; mode: 'pending' | 'swipe' | 'scroll' } | null =
  null
let swallowClick = false

const onPointerDown = (event: PointerEvent) => {
  // A swipe ends without a click, so a flag it left must not eat this press.
  swallowClick = false
  if (event.pointerType === 'mouse' || (!leadingW.value && !trailingW.value)) return
  press = { id: event.pointerId, x: event.clientX, y: event.clientY, base: offset.value, mode: 'pending' }
}
const onPointerMove = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.id) return
  const dx = event.clientX - press.x
  const dy = event.clientY - press.y
  if (press.mode === 'pending') {
    if (Math.abs(dy) > AXIS_LOCK && Math.abs(dy) > Math.abs(dx)) press.mode = 'scroll'
    else if (Math.abs(dx) > AXIS_LOCK) press.mode = 'swipe'
  }
  if (press.mode !== 'swipe') return
  dragging.value = true
  offset.value = Math.min(leadingW.value, Math.max(-trailingW.value, press.base + dx))
}
const onPointerUp = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.id) return
  const swiped = press.mode === 'swipe'
  press = null
  dragging.value = false
  if (!swiped) return
  swallowClick = true
  if (offset.value > leadingW.value / 2) offset.value = leadingW.value
  else if (offset.value < -trailingW.value / 2) offset.value = -trailingW.value
  else offset.value = 0
}

// Capture phase: with `href` the row is a RouterLink, whose own click
// listener navigates before a bubble-phase one could cancel it.
const onRowClick = (event: MouseEvent) => {
  if (swallowClick || offset.value !== 0) {
    swallowClick = false
    event.preventDefault()
    event.stopPropagation()
    offset.value = 0
    return
  }
  emit('click', event)
}
const onAction = (action: KunChatSwipeAction) => {
  offset.value = 0
  emit('action', action.key)
}
</script>

<template>
  <div
    class="kun-chat-conversation-item relative overflow-hidden rounded-kun-md"
    :style="rootStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      v-if="leadingW"
      class="absolute inset-y-0 left-0 flex"
      :aria-hidden="offset <= 0"
      :style="{ visibility: offset > 0 ? 'visible' : 'hidden' }"
    >
      <button
        v-for="a in leadingActions"
        :key="a.key"
        type="button"
        :tabindex="offset > 0 ? 0 : -1"
        :class="cn('flex flex-col items-center justify-center gap-1 text-xs', kunSolidClasses[a.color ?? 'primary'])"
        :style="{ width: `${ACTION_W}px` }"
        @click="onAction(a)"
      >
        <KunIcon v-if="a.icon" :name="a.icon" class="text-lg" />
        <span class="max-w-full truncate px-1">{{ a.label }}</span>
      </button>
    </div>
    <div
      v-if="trailingW"
      class="absolute inset-y-0 right-0 flex"
      :aria-hidden="offset >= 0"
      :style="{ visibility: offset < 0 ? 'visible' : 'hidden' }"
    >
      <button
        v-for="a in trailingActions"
        :key="a.key"
        type="button"
        :tabindex="offset < 0 ? 0 : -1"
        :class="cn('flex flex-col items-center justify-center gap-1 text-xs', kunSolidClasses[a.color ?? 'default'])"
        :style="{ width: `${ACTION_W}px` }"
        @click="onAction(a)"
      >
        <KunIcon v-if="a.icon" :name="a.icon" class="text-lg" />
        <span class="max-w-full truncate px-1">{{ a.label }}</span>
      </button>
    </div>

    <component
      :is="href ? config.linkComponent : 'button'"
      v-bind="rowBinding"
      :aria-current="selected ? 'true' : undefined"
      :class="
        cn(
          'relative flex w-full items-center gap-3 px-3 py-2 text-left [:where(&)_*]:text-inherit',
          selected ? 'bg-primary text-primary-foreground' : 'bg-content1 hover:bg-default/10',
          !dragging && 'transition-[transform,background-color] duration-kun-base ease-kun-out'
        )
      "
      :style="offset ? { transform: `translateX(${offset}px)` } : undefined"
      @click.capture="onRowClick"
    >
      <KunAvatar :user="avatarUser" size="xl" :is-navigation="false" class="shrink-0" />
      <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="flex items-center gap-1.5">
          <span class="truncate font-semibold">{{ name }}</span>
          <KunIcon
            v-if="muted"
            name="lucide:bell-off"
            :class="cn('shrink-0 text-xs', selected ? 'opacity-80' : 'text-default-400')"
            :aria-label="t('chat.muted')"
          />
          <span
            :class="
              cn(
                'ml-auto flex shrink-0 items-center gap-1 text-xs',
                selected ? 'text-primary-foreground' : 'text-foreground-muted'
              )
            "
          >
            <KunIcon
              v-if="status"
              :name="statusIcon"
              :class="cn('text-sm', status === 'failed' ? 'text-danger-text' : !selected && 'text-primary-text')"
              :aria-label="t(`chatStatus.${status}`)"
            />
            {{ time }}
          </span>
        </span>
        <span class="flex items-center gap-1.5">
          <span
            :class="cn('min-w-0 flex-1 truncate text-sm', selected ? 'text-primary-foreground' : 'text-foreground-muted')"
          >
            <KunChatTyping
              v-if="typingActive"
              :class="selected ? 'text-primary-foreground' : 'text-primary-text'"
              :events="typing"
              :users="users"
              :kind="kind"
            />
            <template v-else-if="draftText">
              <span :class="selected ? 'font-medium' : 'text-danger-text'">{{ t('chat.draft') }}</span>
              <KunChatText :text="draftText.text" :entities="draftText.entities" preview />
            </template>
            <template v-else-if="lastMessage">
              <template v-if="lastMessage.kind === 'service'">{{ serviceText }}</template>
              <template v-else>
                <span v-if="lastMessageSender" :class="!selected && 'text-foreground/80'">
                  {{ t('chat.senderPrefix', { name: lastMessageSender }) }}
                </span>
                <KunIcon v-if="lastMessage.media" name="lucide:image" class="mr-0.5 inline align-[-2px] text-xs" />
                <KunChatText
                  v-if="lastMessage.text"
                  :text="lastMessage.text"
                  :entities="lastMessage.entities"
                  preview
                />
                <span v-else>{{ kunChatMediaLabel(lastMessage.media, t) }}</span>
              </template>
            </template>
          </span>
          <span
            v-if="mentionCount > 0"
            :class="
              cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full',
                selected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
              )
            "
            :aria-label="t('chat.mentioned')"
          >
            <KunIcon name="lucide:at-sign" class="text-xs" />
          </span>
          <span
            v-if="unreadCount > 0 || markedUnread"
            :class="
              cn(
                'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums',
                selected
                  ? 'bg-primary-foreground text-primary'
                  : muted
                    ? 'bg-default text-default-foreground'
                    : 'bg-primary text-primary-foreground'
              )
            "
            :aria-label="unreadCount > 0 ? t('chat.unreadCount', { count: unreadCount }) : undefined"
          >
            {{ unreadCount > 0 ? badge : '' }}
          </span>
          <KunIcon
            v-else-if="pinned"
            name="lucide:pin"
            :class="cn('shrink-0 rotate-45 text-sm', selected ? 'opacity-80' : 'text-default-400')"
            :aria-label="t('chat.pinned')"
          />
        </span>
      </span>
    </component>
  </div>
</template>
