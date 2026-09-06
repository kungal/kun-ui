import { computed, ref, type Ref } from 'vue'

import { warnTopLayerConflict } from '../utils/warnTopLayerConflict'

// ─────────────────────────────────────────────────────────────────────────
// Message store — the framework-neutral half of KunUI's toast system.
//
// This file holds NO mounting logic and NO framework-context coupling. It is
// a module-scope reactive store: `useKunMessage(...)` pushes a toast, the
// mounted `<KunMessageProvider>` reads the store and renders it (Teleported
// to body, inside the real app tree, so it has full context — icons, theme).
//
// This deliberately replaces the original Nuxt-coupled approach, which
// imperatively `render()`-ed the container into a detached node and stole
// `tryUseNuxtApp().vueApp._context` so `@nuxt/icon` wouldn't throw `$nuxt`
// null. That hack broke whenever called outside a Nuxt microtask. The
// store + mounted-provider split (the pattern used by Sonner / react-hot-
// toast / Naive UI) has no context to steal.
// ─────────────────────────────────────────────────────────────────────────

export type KunMessageType = 'warn' | 'success' | 'error' | 'info'

export type KunMessagePosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'

export interface KunMessageOptions {
  id: string
  message: string
  type: KunMessageType
  duration: number
  richText: boolean
  position: KunMessagePosition
  count: number
}

const messages: Ref<KunMessageOptions[]> = ref([])
let seed = 0

// Cap concurrently-visible toasts per position so a burst can't fill the
// screen; the oldest in that position is dropped when the cap is exceeded.
const MAX_VISIBLE_PER_POSITION = 5

// Read side — consumed by <KunMessageProvider>.
export const useKunMessageState = () => ({
  messages: computed(() => messages.value),
  removeMessage: (id: string) => {
    messages.value = messages.value.filter((msg) => msg.id !== id)
  },
})

// Trigger side — call from anywhere (event handlers, stores, etc.). Returns
// the toast id (existing id when an identical toast is de-duplicated).
//
// NOTE: `richText` renders `message` as raw HTML (v-html) in the item. As
// with Element Plus `dangerouslyUseHTMLString`, the caller is responsible
// for passing trusted/sanitized HTML — never pass unsanitized user input
// with richText=true.
export const useKunMessage = (
  messageData: string,
  type: KunMessageType,
  duration = 3000,
  richText = false,
  position: KunMessagePosition = 'top-center'
): string => {
  // Toasts are client-only, ephemeral UI. This store is MODULE-SCOPE, so on the
  // server it's a single array shared by every SSR request (one module instance
  // per process) and is never cleared there (the dismiss timer only runs on the
  // client). A server-side trigger would therefore pile up across requests, bake
  // into every page's SSR HTML, and vanish on hydration (empty client store →
  // hydration mismatch). No-op on the server — trigger toasts from client code.
  if (typeof document === 'undefined') return ''

  warnTopLayerConflict('useKunMessage')

  const existingMessage = messages.value.find(
    (m) =>
      m.message === messageData && m.position === position && m.type === type
  )

  if (existingMessage) {
    existingMessage.count++
    existingMessage.duration = duration
    return existingMessage.id
  }

  seed++
  const id = `message_${seed}`

  const newMessage: KunMessageOptions = {
    id,
    message: messageData,
    type,
    duration,
    richText,
    position,
    count: 1,
  }

  // top-* stacks downward (newest at bottom), bottom-* stacks upward.
  if (position.startsWith('top')) {
    messages.value.push(newMessage)
  } else {
    messages.value.unshift(newMessage)
  }

  // Drop the oldest toast in this position once the cap is exceeded.
  const samePosition = messages.value.filter((m) => m.position === position)
  if (samePosition.length > MAX_VISIBLE_PER_POSITION) {
    const oldest = position.startsWith('top')
      ? samePosition[0]
      : samePosition[samePosition.length - 1]
    if (oldest) messages.value = messages.value.filter((m) => m.id !== oldest.id)
  }

  return id
}
