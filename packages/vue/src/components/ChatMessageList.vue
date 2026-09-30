<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import {
  cn,
  groupKunChatMessages,
  kunChatMessageKey,
  sliceKunChatEntities,
  type KunChatListRow,
  type KunChatMessage,
  type KunChatPhoto,
  type KunChatReplyQuote,
  type KunChatSendStatus,
} from '@kungal/ui-core'
import KunAvatar from './Avatar.vue'
import KunIcon from './Icon.vue'
import KunLightbox from './Lightbox.vue'
import KunChatBubble from './ChatBubble.vue'
import KunChatMessageMenu from './ChatMessageMenu.vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { useKunLocale } from '../locale/useKunLocale'
import { useKunMessage } from '../composables/useKunMessage'
import {
  formatKunChatDay,
  kunChatPlainText,
  kunChatSelectionRange,
  kunChatUserMap,
  resolveKunChatUser,
} from '../utils/chat'
import type {
  KunChatBubblePosition,
  KunChatMessageAction,
  KunChatMessageListProps,
} from './types'

// The conversation's scrollback. The scroller is `flex-direction:
// column-reverse`, so its scroll origin is the bottom: it server-renders at
// the newest message with no JS, and anything that grows above the viewport —
// older pages, rows rendering in, images decoding — leaves the view where it
// is without a single scrollTop write, so an iOS momentum fling through
// history is never cut short (tweb stops pruning on Safari because "Safari
// cannot reset the scroll"). Only changes below the viewport move the view,
// and those are anchored by hand (see `correct`).
defineOptions({ name: 'KunChatMessageList' })

const props = withDefaults(defineProps<KunChatMessageListProps>(), {
  users: () => [],
  kind: 'direct',
  lastReadSeq: null,
  peerReadSeq: null,
  hasOlder: false,
  hasNewer: false,
  loadingOlder: false,
  loadingNewer: false,
  groupWindow: 600,
  reactionOptions: () => [],
  resolveMediaUrl: undefined,
  actions: undefined,
  unreadCount: undefined,
  swipeToReply: true,
  timeZone: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  /** Scrolled near the top while `hasOlder`: fetch the page before. */
  'load-older': []
  /** Scrolled near the bottom while `hasNewer`: fetch the page after. */
  'load-newer': []
  /** The scroll-down button was pressed while `hasNewer`: reload the newest
   *  page, then call `scrollToBottom()`. */
  latest: []
  /** Others' messages up to this seq have been on screen while the page was
   *  visible: mark them read. Only ever increases. */
  read: [seq: number]
  /** A reply target that is not loaded was clicked: load around it
   *  (`around_seq`), then call `scrollToSeq(seq)`. */
  jump: [seq: number]
  /** A menu action, or a swipe (`reply`). `detail.quote` is set for `quote`:
   *  the selected part of the message. `copy` has already been done. */
  action: [action: string, message: KunChatMessage, detail: { quote?: KunChatReplyQuote }]
  /** Set the viewer's reaction on a message, or remove it (null). */
  react: [message: KunChatMessage, reaction: string | null]
  /** Resend a failed message. */
  retry: [message: KunChatMessage]
  /** A sender's avatar or name was clicked. */
  'user-click': [userId: string, event: MouseEvent]
  /** A mention in a message was clicked. */
  mention: [userId: string, event: MouseEvent]
  /** A link in a message was clicked. */
  link: [url: string, event: MouseEvent]
}>()

defineSlots<{
  /** Above the first message once there is no older history, e.g. "this is
   *  the start of your conversation". */
  start?: () => unknown
  /** Shown when there are no messages. */
  empty?: () => unknown
  /** Below the last message, e.g. a typing bubble. */
  footer?: () => unknown
}>()

const config = useKunUIConfig()
const { t, locale } = useKunLocale()

const users = computed(() => kunChatUserMap(props.users))
const sections = computed(() =>
  groupKunChatMessages(props.messages, {
    currentUserId: props.currentUserId,
    lastReadSeq: props.lastReadSeq,
    groupWindow: props.groupWindow,
    timeZone: props.timeZone,
  })
)
type MessageRow = Extract<KunChatListRow, { type: 'message' }>
const rowsByKey = computed(() => {
  const map = new Map<string, Exclude<KunChatListRow, { type: 'unread' }>>()
  for (const day of sections.value) {
    for (const row of day.rows) if (row.type !== 'unread') map.set(row.key, row)
  }
  return map
})
const rowKeyBySeq = computed(() => {
  const map = new Map<number, string>()
  for (const [key, row] of rowsByKey.value) {
    const members = row.type === 'message' ? row.messages : [row.message]
    for (const m of members) if (m.seq > 0) map.set(m.seq, key)
  }
  return map
})
const bySeq = computed(() => new Map(props.messages.filter((m) => m.seq > 0).map((m) => [m.seq, m])))
const resolveMessage = (seq: number) => bySeq.value.get(seq)

const position = (row: MessageRow): KunChatBubblePosition =>
  row.groupStart && row.groupEnd ? 'single' : row.groupStart ? 'first' : row.groupEnd ? 'last' : 'middle'

const statusOf = (row: MessageRow): KunChatSendStatus | undefined => {
  if (!row.own) return undefined
  const m = row.messages[row.messages.length - 1]!
  if (m.status) return m.status
  return props.peerReadSeq != null && m.seq > 0 && m.seq <= props.peerReadSeq ? 'read' : 'sent'
}

const dayLabel = (date: Date) => formatKunChatDay(date, locale.code, t, props.timeZone)
const sender = (id: string) => resolveKunChatUser(users.value, id, t)
const profileHref = (id: string) => config.userLinkTemplate.replace('{id}', encodeURIComponent(id))
const linkBinding = (href: string) =>
  typeof config.linkComponent === 'string' ? { href } : { to: href }

const scroller = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const topSentinel = ref<HTMLElement | null>(null)
const bottomSentinel = ref<HTMLElement | null>(null)

// telegram-tt's BOTTOM_THRESHOLD and FAB_THRESHOLD.
const BOTTOM_THRESHOLD = 50
const distanceFromBottom = () => {
  const el = scroller.value
  // Scroll offsets in a column-reverse scroller run from 0 at the bottom
  // down to negative values going up, in every current engine.
  return el ? Math.max(0, -el.scrollTop) : 0
}
const atBottom = ref(true)

const rowEls = () =>
  Array.from(content.value?.querySelectorAll<HTMLElement>('[data-kun-row]') ?? [])

// The anchor is the lowest row whose top is inside the viewport; keeping its
// top fixed is what "nothing below me moves me" means in a bottom-origin
// scroller. Found by bisection, since a long list has thousands of rows.
let anchor: { el: HTMLElement; top: number } | null = null
const pickAnchor = () => {
  const el = scroller.value
  if (!el) return
  const rows = rowEls()
  const viewBottom = el.getBoundingClientRect().bottom
  let lo = 0
  let hi = rows.length - 1
  let found = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (rows[mid]!.getBoundingClientRect().top < viewBottom) {
      found = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  const row = rows[found]
  anchor = row ? { el: row, top: row.getBoundingClientRect().top } : null
}

// A correction moves nothing on screen, so the message menu must not take its
// scroll event for the reader's: `data-kun-adjusting` marks the scroller until
// that event has been dispatched (scroll events run before the next frame's
// animation callbacks).
const markAdjusting = (el: HTMLElement) => {
  el.dataset.kunAdjusting = ''
  requestAnimationFrame(() => requestAnimationFrame(() => delete el.dataset.kunAdjusting))
}

let stuck = true
const correct = () => {
  const el = scroller.value
  if (!el) return
  if (stuck) {
    if (el.scrollTop !== 0) {
      markAdjusting(el)
      el.scrollTop = 0
    }
  } else if (anchor?.el.isConnected) {
    const delta = anchor.el.getBoundingClientRect().top - anchor.top
    if (Math.abs(delta) >= 0.5) {
      markAdjusting(el)
      el.scrollTop += delta
    }
  }
  pickAnchor()
}

let scrollFrame = 0
const onScroll = () => {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    const d = distanceFromBottom()
    atBottom.value = d <= BOTTOM_THRESHOLD
    stuck = atBottom.value && !props.hasNewer
    pickAnchor()
    checkEdges()
  })
}

const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
  const el = scroller.value
  if (!el) return
  stuck = !props.hasNewer
  el.scrollTo({ top: 0, behavior })
}

const highlighted = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

const rowEl = (key: string) =>
  content.value?.querySelector<HTMLElement>(`[data-kun-row="${CSS.escape(key)}"]`) ?? null

const offsetToShow = (row: HTMLElement, place: 'center' | 'top', margin: number) => {
  const box = scroller.value!.getBoundingClientRect()
  const r = row.getBoundingClientRect()
  // Centred when it fits, else its top just under the top edge (telegram-tt).
  if (place === 'center' && r.height <= box.height - 2 * margin) {
    return r.top - box.top - (box.height - r.height) / 2
  }
  return r.top - box.top - margin
}

/**
 * Scroll a loaded message into view and flash it — for a reply, a pinned
 * message, a search hit. Returns false when the message is not loaded; load
 * around it and call again.
 */
const scrollToSeq = (
  seq: number,
  options: { highlight?: boolean; behavior?: ScrollBehavior } = {}
): boolean => {
  const key = rowKeyBySeq.value.get(seq)
  const row = key ? rowEl(key) : null
  const el = scroller.value
  if (!key || !row || !el) return false
  stuck = false
  const offset = offsetToShow(row, 'center', 20)
  // A long way off, rows between here and there have estimated heights until
  // they render, so land first, let them settle, then correct.
  if (Math.abs(offset) > el.clientHeight * 2) {
    el.scrollBy({ top: offset })
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.scrollBy({ top: offsetToShow(row, 'center', 20) })
        pickAnchor()
      })
    )
  } else {
    el.scrollBy({ top: offset, behavior: options.behavior ?? 'smooth' })
  }
  if (options.highlight !== false) {
    highlighted.value = key
    clearTimeout(highlightTimer)
    highlightTimer = setTimeout(() => (highlighted.value = null), 1500)
  }
  return true
}

const onReplyClick = (seq: number) => {
  if (!scrollToSeq(seq)) emit('jump', seq)
}

// The unread divider 10 px under the top edge (telegram-tt's
// UNREAD_DIVIDER_TOP), or the bottom — which a bottom-origin scroller already
// is, from the server's HTML on.
let positioned = false
const positionInitially = () => {
  if (positioned || !props.messages.length || !scroller.value) return
  positioned = true
  const divider = content.value?.querySelector<HTMLElement>('[data-kun-unread]')
  if (divider) {
    stuck = false
    const el = scroller.value
    el.scrollBy({ top: offsetToShow(divider, 'top', 10) })
    // Rows between the bottom and the divider had estimated heights until
    // this scroll rendered them; land again once they have their own.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!divider.isConnected) return
        el.scrollBy({ top: offsetToShow(divider, 'top', 10) })
        pickAnchor()
      })
    )
  }
  atBottom.value = distanceFromBottom() <= BOTTOM_THRESHOLD
  stuck = atBottom.value && !props.hasNewer
  pickAnchor()
}

let olderPending = false
let newerPending = false
const EDGE_MARGIN = 800

const checkEdges = () => {
  const el = scroller.value
  if (!el) return
  const box = el.getBoundingClientRect()
  const top = topSentinel.value?.getBoundingClientRect()
  const bottom = bottomSentinel.value?.getBoundingClientRect()
  if (props.hasOlder && !props.loadingOlder && !olderPending && top && top.bottom > box.top - EDGE_MARGIN) {
    olderPending = true
    emit('load-older')
  }
  if (props.hasNewer && !props.loadingNewer && !newerPending && bottom && bottom.top < box.bottom + EDGE_MARGIN) {
    newerPending = true
    emit('load-newer')
  }
}
// A request is answered by the loading flag coming back down, or — for a site
// that binds no loading flag — by the edge message changing. Either way, look
// at the edges again: the page that arrived may not have filled the view.
const edgeKey = (m: KunChatMessage | undefined) => (m ? kunChatMessageKey(m) : '')
watch(
  () => [props.loadingOlder, props.hasOlder, edgeKey(props.messages[0])],
  () => {
    olderPending = false
    nextTick(checkEdges)
  }
)
watch(
  () => [props.loadingNewer, props.hasNewer, edgeKey(props.messages[props.messages.length - 1])],
  () => {
    newerPending = false
    nextTick(checkEdges)
  }
)

const readUpTo = ref(props.lastReadSeq ?? 0)
watch(
  () => props.lastReadSeq,
  (seq) => {
    if (seq != null && seq > readUpTo.value) readUpTo.value = seq
  }
)
const visibleUnread = new Set<number>()
let readObserver: IntersectionObserver | null = null
let readFrame = 0

const flushRead = () => {
  readFrame = 0
  if (document.visibilityState !== 'visible' || !visibleUnread.size) return
  const max = Math.max(...visibleUnread)
  visibleUnread.clear()
  if (max > readUpTo.value) {
    readUpTo.value = max
    emit('read', max)
  }
}
const onVisibility = () => {
  if (document.visibilityState !== 'visible') return
  // Markers that were already on screen while the page was hidden never
  // fire again; look for them now.
  const box = scroller.value?.getBoundingClientRect()
  content.value?.querySelectorAll<HTMLElement>('[data-kun-read]').forEach((m) => {
    const r = m.getBoundingClientRect()
    if (box && r.top >= box.top && r.bottom <= box.bottom) visibleUnread.add(Number(m.dataset.kunRead))
  })
  flushRead()
}
const observeMarkers = () => {
  if (!readObserver) return
  readObserver.disconnect()
  content.value?.querySelectorAll('[data-kun-read]').forEach((m) => readObserver!.observe(m))
}

// Service messages count as unread too (the server counts them), so they
// carry a read marker like any other row from someone else.
const unreadSeq = (row: Exclude<KunChatListRow, { type: 'unread' }>) => {
  const members = row.type === 'message' ? row.messages : [row.message]
  if (row.message.sender_id === props.currentUserId) return null
  const seq = Math.max(...members.map((m) => m.seq))
  return seq > readUpTo.value ? seq : null
}

const localUnread = computed(
  () =>
    props.messages.filter(
      (m) => m.sender_id !== props.currentUserId && m.seq > readUpTo.value
    ).length
)
const fabCount = computed(() => props.unreadCount ?? localUnread.value)
const showFab = computed(() => !atBottom.value || props.hasNewer)

const onFab = () => {
  if (props.hasNewer) emit('latest')
  else scrollToBottom('smooth')
}

const announcements = ref<{ id: string; text: string }[]>([])
let lastKey: string | null = null

// Another conversation in the same instance (a site that does not re-key the
// list) is a fresh open: position it again, forget the old one's reading.
watch(
  () => props.messages[0]?.conversation_id,
  (next, prev) => {
    if (prev === undefined || next === prev) return
    positioned = false
    lastKey = null
    readUpTo.value = props.lastReadSeq ?? 0
    announcements.value = []
    visibleUnread.clear()
  },
  { flush: 'pre' }
)

// Whether the list stopped short of the newest message before this update:
// then whatever arrived at the end is a page of history, not live traffic.
let newerBefore = props.hasNewer

// `deep: 1`: a site may push into its array rather than replace it.
watch(
  () => props.messages,
  () => pickAnchor(),
  { flush: 'pre', deep: 1 }
)
watch(
  () => props.messages,
  (messages) => {
    const newLast = messages[messages.length - 1]
    const prevIndex = lastKey ? messages.findIndex((m) => kunChatMessageKey(m) === lastKey) : -1
    const appended = prevIndex >= 0 && !newerBefore ? messages.slice(prevIndex + 1) : []
    lastKey = newLast ? kunChatMessageKey(newLast) : null
    newerBefore = props.hasNewer

    if (!positioned) {
      positionInitially()
    } else if (appended.some((m) => m.sender_id === props.currentUserId && m.status === 'sending')) {
      // Sending takes you to your message, wherever you were. Only a pending
      // send: the viewer's messages also arrive from their other devices.
      scrollToBottom()
      pickAnchor()
    } else {
      correct()
    }

    const incoming = appended.filter((m) => m.sender_id !== props.currentUserId && m.kind === 'message')
    if (incoming.length) {
      announcements.value = [
        ...announcements.value,
        ...incoming.map((m) => ({
          id: kunChatMessageKey(m),
          text: t('chat.senderPrefix', { name: sender(m.sender_id).name }) + kunChatPlainText(m, t),
        })),
      ].slice(-3)
    }
    observeMarkers()
    checkEdges()
  },
  { flush: 'post', deep: 1 }
)
watch(
  () => props.hasNewer,
  (v) => (newerBefore = v),
  { flush: 'post' }
)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  lastKey = props.messages.length ? kunChatMessageKey(props.messages[props.messages.length - 1]!) : null
  positionInitially()
  // Content grows and shrinks on its own too — photos decode, rows render in,
  // reactions land. The observer runs after layout and before paint, so the
  // correction is never seen.
  resizeObserver = new ResizeObserver(() => correct())
  if (content.value) resizeObserver.observe(content.value)
  readObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleUnread.add(Number((e.target as HTMLElement).dataset.kunRead))
      }
      if (!readFrame) readFrame = requestAnimationFrame(flushRead)
    },
    { root: scroller.value }
  )
  observeMarkers()
  document.addEventListener('visibilitychange', onVisibility)
  checkEdges()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  readObserver?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  cancelAnimationFrame(scrollFrame)
  cancelAnimationFrame(readFrame)
  clearTimeout(highlightTimer)
  clearTimeout(pressTimer)
})

const menu = shallowRef<{
  message: KunChatMessage
  own: boolean
  position: { x: number; y: number }
  actions: KunChatMessageAction[]
  quote: KunChatReplyQuote | null
  selection: string
} | null>(null)

const rowFromEvent = (event: Event) => {
  const el = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-kun-row]')
  const row = el ? rowsByKey.value.get(el.dataset.kunRow!) : undefined
  return el && row && row.type === 'message' ? { el, row } : null
}

const openMenu = (el: HTMLElement, row: MessageRow, x: number, y: number) => {
  const message = row.message
  const allowed = props.actions?.(message, row.own) ?? ['reply', 'copy']
  const range = message.text ? kunChatSelectionRange(el) : null
  const quote = range
    ? { ...sliceKunChatEntities(message.text, message.entities, range[0], range[1]), offset: range[0] }
    : null
  const status = statusOf(row)
  const actions = allowed.filter((a) => {
    const key = typeof a === 'string' ? a : a.key
    if (key === 'copy') return !!message.text
    if (key === 'quote') return !!quote
    if (key === 'retry') return status === 'failed'
    return true
  })
  menu.value = {
    message,
    own: row.own,
    position: { x, y },
    actions,
    quote,
    selection: quote?.text ?? '',
  }
}

const onContextMenu = (event: MouseEvent) => {
  const hit = rowFromEvent(event)
  if (!hit) return
  // A link keeps the browser's own menu: open in a new tab, copy the address.
  if ((event.target as HTMLElement).closest('a[href]') && !window.getSelection()?.toString()) return
  event.preventDefault()
  // The context-menu key fires this too, with no pointer position to use.
  if (event.button !== 0 || (event.clientX === 0 && event.clientY === 0)) {
    if (event.target === hit.el) return menuAtRow(hit.el, hit.row)
  }
  openMenu(hit.el, hit.row, event.clientX, event.clientY)
}

const onMenuSelect = async (action: string) => {
  const current = menu.value
  if (!current) return
  if (action === 'copy') {
    try {
      await navigator.clipboard.writeText(current.selection || current.message.text)
      useKunMessage(t('chatMenu.copied'), 'success')
    } catch (err) {
      console.error('[KunUI] copy failed:', err)
    }
  }
  if (action === 'retry') {
    emit('retry', current.message)
    return
  }
  emit('action', action, current.message, action === 'quote' && current.quote ? { quote: current.quote } : {})
}

const currentReaction = computed(
  () => menu.value?.message.reactions.find((r) => r.reacted)?.reaction ?? null
)

// tweb's numbers: 64 px of travel at most, 48 to trigger, 20 before the axis
// locks, and nothing from the 30 px along the left edge, which iOS keeps for
// its back gesture.
const SWIPE_MAX = 64
const SWIPE_TRIGGER = 48
const AXIS_LOCK = 20
const EDGE_GUARD = 30
const LONG_PRESS_MS = 450

let press: {
  id: number
  x: number
  y: number
  el: HTMLElement
  row: MessageRow
  mode: 'pending' | 'swipe' | 'scroll'
  dx: number
} | null = null
let pressTimer: ReturnType<typeof setTimeout> | undefined
let swallowClick = false
let longPressed: number | null = null

// The menu opens under the finger, and the click the browser synthesizes when
// that finger lifts — after holds of up to 2.5 s at least (Chrome 153, CDP
// touch) — landed on the menu's first item and chose it. So the click that
// follows that finger's lift is swallowed, wherever it lands; where no click
// follows, the listener lapses a moment later.
const swallowNextClick = () => {
  const swallow = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }
  window.addEventListener('click', swallow, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 400)
}

const swipeTarget = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-kun-swipe]')
const swipeIcon = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-kun-swipe-icon]')

const onPointerDown = (event: PointerEvent) => {
  // A swipe ends without a click (Chrome 153 fires none after a horizontal
  // drag on a `pan-y` element), so a flag it left must not eat this press.
  swallowClick = false
  if (event.pointerType === 'mouse') return
  const hit = rowFromEvent(event)
  if (!hit) return
  press = { id: event.pointerId, x: event.clientX, y: event.clientY, ...hit, mode: 'pending', dx: 0 }
  clearTimeout(pressTimer)
  pressTimer = setTimeout(() => {
    if (!press || press.mode !== 'pending') return
    longPressed = press.id
    openMenu(press.el, press.row, press.x, press.y)
    press = null
  }, LONG_PRESS_MS)
}

const onPointerMove = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.id) return
  const dx = event.clientX - press.x
  const dy = event.clientY - press.y
  if (press.mode === 'pending') {
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) clearTimeout(pressTimer)
    const canSwipe =
      props.swipeToReply &&
      press.x > EDGE_GUARD &&
      !(event.target as HTMLElement).closest('pre')
    if (Math.abs(dy) > AXIS_LOCK) press.mode = 'scroll'
    else if (canSwipe && -dx > AXIS_LOCK && Math.abs(dx) > Math.abs(dy)) press.mode = 'swipe'
  }
  if (press.mode !== 'swipe') return
  press.dx = Math.min(SWIPE_MAX, Math.max(0, -dx))
  const target = swipeTarget(press.el)
  const icon = swipeIcon(press.el)
  if (target) {
    target.style.transition = 'none'
    target.style.transform = `translateX(${-press.dx}px)`
  }
  if (icon) icon.style.opacity = String(Math.min(1, press.dx / SWIPE_TRIGGER))
}

const endPress = (event: PointerEvent) => {
  clearTimeout(pressTimer)
  if (longPressed === event.pointerId) {
    longPressed = null
    if (event.type === 'pointerup') swallowNextClick()
    return
  }
  if (!press || event.pointerId !== press.id) return
  const { el, row, mode, dx } = press
  press = null
  if (mode !== 'swipe') return
  swallowClick = true
  const target = swipeTarget(el)
  const icon = swipeIcon(el)
  if (target) {
    target.style.transition = 'transform 250ms var(--ease-kun-out, ease-out)'
    target.style.transform = ''
  }
  if (icon) icon.style.opacity = '0'
  if (event.type === 'pointerup' && dx >= SWIPE_TRIGGER) {
    emit('action', 'reply', row.message, {})
  }
}

const onClickCapture = (event: MouseEvent) => {
  if (!swallowClick) return
  swallowClick = false
  event.preventDefault()
  event.stopPropagation()
}

const photos = computed(() =>
  props.messages.filter((m) => m.media?.type === 'photo') as (KunChatMessage & { media: KunChatPhoto })[]
)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = computed(() =>
  photos.value.map((m) => ({
    src: props.resolveMediaUrl?.(m.media, 'original') ?? m.media.url ?? '',
    alt: t('chat.photoFrom', { name: sender(m.sender_id).name }),
  }))
)
const openPhoto = (row: MessageRow, index: number) => {
  const target = row.messages[index] ?? row.message
  const at = photos.value.findIndex((m) => kunChatMessageKey(m) === kunChatMessageKey(target))
  if (at < 0) return
  lightboxIndex.value = at
  lightboxOpen.value = true
}

// Keyboard: one row is in the tab order (the one last focused, else the
// newest), ↑/↓/Home/End move between rows, and Enter, Shift+F10 or the
// context-menu key opens the menu — the only way to reply to or react to a
// text-only message without a pointer.
const focusKey = ref<string | null>(null)
const lastRowKey = computed(() => {
  const days = sections.value
  for (let d = days.length - 1; d >= 0; d--) {
    const rows = days[d]!.rows
    for (let r = rows.length - 1; r >= 0; r--) if (rows[r]!.type !== 'unread') return rows[r]!.key
  }
  return null
})
const activeKey = computed(() =>
  focusKey.value && rowsByKey.value.has(focusKey.value) ? focusKey.value : lastRowKey.value
)
const menuAtRow = (el: HTMLElement, row: MessageRow) => {
  const r = (el.querySelector('.kun-chat-bubble') ?? el).getBoundingClientRect()
  openMenu(el, row, r.left + 16, r.bottom - 8)
}
const onFocusIn = (event: FocusEvent) => {
  const el = event.target as HTMLElement
  if (el.matches('[data-kun-row]')) focusKey.value = el.dataset.kunRow!
}
const onRowKeydown = (event: KeyboardEvent) => {
  const el = event.target as HTMLElement
  if (!el.matches('[data-kun-row]')) return
  const rows = rowEls()
  const go = (i: number) => rows[Math.max(0, Math.min(rows.length - 1, i))]?.focus()
  const i = rows.indexOf(el)
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    go(i + (event.key === 'ArrowUp' ? -1 : 1))
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    go(event.key === 'Home' ? 0 : rows.length - 1)
  } else if (event.key === 'Enter' || (event.key === 'F10' && event.shiftKey)) {
    const hit = rowFromEvent(event)
    if (!hit) return
    event.preventDefault()
    menuAtRow(hit.el, hit.row)
  }
}

defineExpose({
  scrollToSeq,
  scrollToBottom,
  /** Whether the view is at the newest message. */
  atBottom,
})
</script>

<template>
  <div class="kun-chat-message-list relative flex min-h-0 flex-col">
    <div
      ref="scroller"
      role="region"
      :aria-label="ariaLabel ?? t('chat.messages')"
      class="min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none"
      :style="{ display: 'flex', flexDirection: 'column-reverse', overflowAnchor: 'none' }"
      @scroll.passive="onScroll"
    >
      <div
        ref="content"
        class="flex flex-col py-2"
        @contextmenu="onContextMenu"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endPress"
        @pointercancel="endPress"
        @click.capture="onClickCapture"
        @keydown="onRowKeydown"
        @focusin="onFocusIn"
      >
        <div ref="topSentinel" class="h-px shrink-0" aria-hidden="true" />
        <div v-if="loadingOlder" class="text-default-500 flex justify-center py-3">
          <KunIcon name="svg-spinners:90-ring-with-bg" class="text-xl" :aria-label="t('chat.loading')" />
        </div>
        <slot v-else-if="!hasOlder && messages.length" name="start" />
        <div v-if="!messages.length && !loadingOlder" class="text-foreground-muted py-10 text-center text-sm">
          <slot name="empty">{{ t('chat.empty') }}</slot>
        </div>

        <section v-for="day in sections" :key="day.key" class="relative">
          <div class="pointer-events-none sticky top-2 z-10 flex justify-center py-1.5">
            <span class="bg-content1 text-default-600 rounded-full px-3 py-0.5 text-xs font-medium shadow-kun-sm">
              {{ dayLabel(day.date) }}
            </span>
          </div>

          <template v-for="row in day.rows" :key="row.key">
            <div
              v-if="row.type === 'unread'"
              data-kun-unread
              class="bg-default/15 text-default-600 my-2 py-1 text-center text-xs font-medium"
            >
              {{ t('chat.unreadDivider') }}
            </div>

            <div
              v-else-if="row.type === 'service'"
              :data-kun-row="row.key"
              role="article"
              :tabindex="row.key === activeKey ? 0 : -1"
              :class="
                cn(
                  'kun-chat-row relative py-1.5 outline-none focus-visible:bg-primary/10',
                  highlighted === row.key && 'kun-chat-row-flash'
                )
              "
            >
              <KunChatBubble
                :message="row.message"
                :users="props.users"
                :current-user-id="currentUserId"
                :resolve-message="resolveMessage"
              />
              <span
                v-if="unreadSeq(row) !== null"
                :data-kun-read="unreadSeq(row)"
                aria-hidden="true"
                class="pointer-events-none absolute bottom-0 left-0 h-px w-px"
              />
            </div>

            <div
              v-else
              :data-kun-row="row.key"
              role="article"
              :tabindex="row.key === activeKey ? 0 : -1"
              :class="
                cn(
                  'kun-chat-row relative px-2 outline-none focus-visible:bg-primary/10 sm:px-3',
                  row.groupEnd ? 'pb-2' : 'pb-0.5',
                  highlighted === row.key && 'kun-chat-row-flash'
                )
              "
            >
              <div
                data-kun-swipe
                :class="cn('flex items-end gap-2', row.own ? 'flex-row-reverse' : 'flex-row')"
              >
                <div v-if="kind === 'group' && !row.own" class="w-8 shrink-0">
                  <template v-if="row.groupEnd">
                    <KunAvatar
                      v-if="sender(row.message.sender_id).deleted"
                      :user="sender(row.message.sender_id).avatarUser"
                      :is-navigation="false"
                    />
                    <component
                      :is="config.linkComponent"
                      v-else
                      v-bind="linkBinding(profileHref(row.message.sender_id))"
                      class="block rounded-full"
                      :aria-label="sender(row.message.sender_id).name"
                      @click.capture="(e: MouseEvent) => emit('user-click', row.message.sender_id, e)"
                    >
                      <KunAvatar :user="sender(row.message.sender_id).avatarUser" :is-navigation="false" />
                    </component>
                  </template>
                </div>
                <KunChatBubble
                  :message="row.message"
                  :album="row.messages.length > 1 ? row.messages : null"
                  :own="row.own"
                  :users="props.users"
                  :current-user-id="currentUserId"
                  :show-sender="kind === 'group' && !row.own && row.groupStart"
                  :position="position(row)"
                  :status="statusOf(row)"
                  :reaction-options="reactionOptions"
                  :resolve-media-url="resolveMediaUrl"
                  :resolve-message="resolveMessage"
                  :time-zone="timeZone"
                  :lightbox="false"
                  @reply-click="onReplyClick"
                  @react="(r) => emit('react', row.message, r)"
                  @retry="emit('retry', row.messages[row.messages.length - 1]!)"
                  @photo-click="(i) => openPhoto(row, i)"
                  @user-click="(id, e) => emit('user-click', id, e)"
                  @mention="(id, e) => emit('mention', id, e)"
                  @link="(url, e) => emit('link', url, e)"
                />
              </div>
              <span
                v-if="swipeToReply"
                data-kun-swipe-icon
                aria-hidden="true"
                class="bg-default/30 pointer-events-none absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full"
                :style="{ opacity: 0 }"
              >
                <KunIcon name="lucide:reply" />
              </span>
              <span
                v-if="unreadSeq(row) !== null"
                :data-kun-read="unreadSeq(row)"
                aria-hidden="true"
                class="pointer-events-none absolute bottom-0 left-0 h-px w-px"
              />
            </div>
          </template>
        </section>

        <div v-if="loadingNewer" class="text-default-500 flex justify-center py-3">
          <KunIcon name="svg-spinners:90-ring-with-bg" class="text-xl" :aria-label="t('chat.loading')" />
        </div>
        <div ref="bottomSentinel" class="h-px shrink-0" aria-hidden="true" />
        <slot name="footer" />
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-kun-base ease-kun-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-kun-exit ease-kun-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="showFab"
        type="button"
        class="bg-content1 text-default-600 hover:text-foreground absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full shadow-kun-md transition-colors"
        :aria-label="fabCount ? t('chat.scrollToBottomUnread', { count: fabCount }) : t('chat.scrollToBottom')"
        @click="onFab"
      >
        <KunIcon name="lucide:chevron-down" class="text-xl" />
        <span
          v-if="fabCount"
          aria-hidden="true"
          class="bg-primary text-primary-foreground absolute -top-1.5 left-1/2 min-w-5 -translate-x-1/2 rounded-full px-1.5 text-center text-xs leading-5 font-medium tabular-nums"
        >
          {{ fabCount > 999 ? '999+' : fabCount }}
        </span>
      </button>
    </Transition>

    <!-- New messages from others, for screen readers. The visible list is
         not a live region: loading older history would read out every page. -->
    <div class="sr-only" role="log" aria-live="polite" aria-relevant="additions">
      <p v-for="a in announcements" :key="a.id">{{ a.text }}</p>
    </div>

    <KunChatMessageMenu
      :visible="!!menu"
      :position="menu?.position"
      :actions="menu?.actions ?? []"
      :reactions="menu && menu.message.kind === 'message' ? reactionOptions : []"
      :current-reaction="currentReaction"
      @select="onMenuSelect"
      @react="(r) => menu && emit('react', menu.message, r)"
      @close="menu = null"
    />

    <KunLightbox
      v-if="photos.length"
      v-model:is-open="lightboxOpen"
      :images="lightboxImages"
      :initial-index="lightboxIndex"
    />
  </div>
</template>

<style scoped>
/* Rows off screen skip layout and paint; `auto` remembers each row's real
   height once it has rendered, so scrolling back does not jump. */
.kun-chat-row {
  content-visibility: auto;
  contain-intrinsic-size: auto 64px;
  touch-action: pan-y pinch-zoom;
}
/* A long press is the menu, not a text selection or the iOS callout. */
@media (pointer: coarse) {
  .kun-chat-row {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
}
.kun-chat-row-flash {
  animation: kun-chat-flash 1.5s ease-out;
}
@keyframes kun-chat-flash {
  0%,
  20% {
    background-color: oklch(var(--primary-500) / 0.18);
  }
  100% {
    background-color: transparent;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kun-chat-row-flash {
    animation-duration: 0.01s;
    outline: 2px solid oklch(var(--primary-500) / 0.5);
    outline-offset: -2px;
  }
}
</style>
