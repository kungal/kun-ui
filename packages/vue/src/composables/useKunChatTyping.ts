import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  KUN_CHAT_TYPING_TIMEOUT,
  type KunChatTypingEvent,
  type KunChatUser,
} from '@kungal/ui-core'
import { useKunLocale } from '../locale/useKunLocale'
import { kunChatUserMap, resolveKunChatUser } from '../utils/chat'

export interface UseKunChatTypingSource {
  /** Typing notifications as received, each stamped with the receiving
   *  client's `Date.now()`. Older ones may stay in the array; they expire. */
  events?: readonly KunChatTypingEvent[] | null
  users?: readonly KunChatUser[] | null
  /** A direct chat says "typing…" without a name. */
  kind?: 'direct' | 'group'
}

/**
 * Who is typing right now, and the sentence for it. A notification counts for
 * `KUN_CHAT_TYPING_TIMEOUT` (6 s) after it arrived and then expires on its
 * own — the site only forwards what it receives. Behind KunChatTyping,
 * KunChatHeader and KunChatConversationItem; exported for a custom surface.
 */
export const useKunChatTyping = (source: () => UseKunChatTypingSource) => {
  const { t, locale } = useKunLocale()
  const now = ref(Date.now())
  let timer: ReturnType<typeof setTimeout> | undefined

  const typing = computed(() => {
    const latest = new Map<string, number>()
    for (const e of source().events ?? []) {
      if (now.value - e.at < KUN_CHAT_TYPING_TIMEOUT) {
        latest.set(e.user_id, Math.max(latest.get(e.user_id) ?? 0, e.at))
      }
    }
    return latest
  })

  const schedule = () => {
    clearTimeout(timer)
    timer = undefined
    if (!typing.value.size) return
    const soonest = Math.min(...typing.value.values()) + KUN_CHAT_TYPING_TIMEOUT
    timer = setTimeout(() => {
      now.value = Date.now()
      schedule()
    }, Math.max(0, soonest - Date.now()) + 16)
  }

  onMounted(() => {
    watch(
      () => source().events,
      () => {
        now.value = Date.now()
        schedule()
      },
      { immediate: true, deep: true }
    )
  })
  onBeforeUnmount(() => clearTimeout(timer))

  const userIds = computed(() => [...typing.value.keys()])
  const active = computed(() => userIds.value.length > 0)
  const label = computed(() => {
    const ids = userIds.value
    const src = source()
    if (!ids.length) return ''
    if (src.kind !== 'group') return t('chatTyping.typing')
    const users = kunChatUserMap(src.users)
    const names = ids.map((id) => resolveKunChatUser(users, id, t).name)
    if (names.length === 1) return t('chatTyping.one', { name: names[0]! })
    if (names.length <= 3) {
      const joined = new Intl.ListFormat(locale.code, { type: 'conjunction' }).format(names)
      return t('chatTyping.several', { names: joined })
    }
    return t('chatTyping.many', { name: names[0]!, count: names.length - 1 })
  })

  return { active, userIds, label }
}
