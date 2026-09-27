import {
  kunChatDayKey,
  normalizeKunChatEntities,
  type KunChatMedia,
  type KunChatMessage,
  type KunChatUser,
  type KunTranslate,
  type KunUser,
} from '@kungal/ui-core'

/** Turns a media object into an image URL. `preview` is what a bubble shows,
 *  `original` what the lightbox opens. */
export type KunChatMediaUrlResolver = (
  media: KunChatMedia,
  variant: 'preview' | 'original'
) => string

export interface KunChatResolvedUser {
  id: string
  name: string
  avatar: string
  deleted: boolean
  /** For KunAvatar. Id 0: chat ids are strings, and the chat components
   *  link to a profile themselves. */
  avatarUser: KunUser
}

export const kunChatUserMap = (users: readonly KunChatUser[] | null | undefined) =>
  new Map((users ?? []).map((u) => [u.id, u]))

/** A user by id; one missing from `users` is treated as deleted, which is
 *  also how the server ships a deleted account. */
export const resolveKunChatUser = (
  users: ReadonlyMap<string, KunChatUser>,
  id: string | null | undefined,
  t: KunTranslate
): KunChatResolvedUser => {
  const user = id ? users.get(id) : undefined
  const deleted = !user || !!user.deleted
  const name = deleted ? t('chat.deletedUser') : user.name
  const avatar = deleted ? '' : user.avatar
  return {
    id: id ?? '',
    name,
    avatar,
    deleted,
    avatarUser: { id: 0, name: deleted ? '' : name, avatar },
  }
}

// Intl formatters are costly to build and a long list formats hundreds of
// timestamps, so they are cached per locale, zone and shape.
const formatters = new Map<string, Intl.DateTimeFormat>()
const format = (
  date: Date,
  locale: string,
  timeZone: string | undefined,
  options: Intl.DateTimeFormatOptions
) => {
  const key = `${locale}|${timeZone ?? ''}|${JSON.stringify(options)}`
  let fmt = formatters.get(key)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { ...options, timeZone })
    formatters.set(key, fmt)
  }
  return fmt.format(date)
}

export const kunChatDate = (value: string | number | Date) =>
  value instanceof Date ? value : new Date(value)

/** Date and time in full, for a tooltip: `2026年9月27日 14:05`. */
export const formatKunChatFullTime = (value: string | number | Date, locale: string, timeZone?: string) =>
  format(kunChatDate(value), locale, timeZone, { dateStyle: 'medium', timeStyle: 'short' })

/** Clock time in the locale's own short form: `02:05`, `2:05 PM`. */
export const formatKunChatTime = (value: string | number | Date, locale: string, timeZone?: string) =>
  format(kunChatDate(value), locale, timeZone, { timeStyle: 'short' })

/** The date pill over a day of messages: today, yesterday, `9月27日`, and the
 *  year only when it is not this one. */
export const formatKunChatDay = (
  value: string | number | Date,
  locale: string,
  t: KunTranslate,
  timeZone?: string,
  now: Date = new Date()
) => {
  const date = kunChatDate(value)
  const key = kunChatDayKey(date, timeZone)
  const today = kunChatDayKey(now, timeZone)
  if (key === today) return t('chat.today')
  if (key === kunChatDayKey(new Date(now.getTime() - 86_400_000), timeZone)) return t('chat.yesterday')
  return format(date, locale, timeZone, {
    ...(key.slice(0, 4) === today.slice(0, 4) ? {} : { year: 'numeric' }),
    month: 'long',
    day: 'numeric',
  })
}

/** The time on a conversation row: clock time today, the weekday within a
 *  week, then a short date. */
export const formatKunChatListTime = (
  value: string | number | Date,
  locale: string,
  timeZone?: string,
  now: Date = new Date()
) => {
  const date = kunChatDate(value)
  const key = kunChatDayKey(date, timeZone)
  const today = kunChatDayKey(now, timeZone)
  if (key === today) return formatKunChatTime(date, locale, timeZone)
  const days = (now.getTime() - date.getTime()) / 86_400_000
  if (days < 6.5) return format(date, locale, timeZone, { weekday: 'short' })
  return format(date, locale, timeZone, {
    ...(key.slice(0, 4) === today.slice(0, 4) ? {} : { year: 'numeric' }),
    month: 'numeric',
    day: 'numeric',
  })
}


const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

/**
 * An href safe to render from another user's message, or null. A bare
 * `moyu.moe/x` gets `https://`; anything but http(s) and mailto — above all
 * `javascript:` — is refused, and the text renders unlinked.
 */
export const kunChatSafeUrl = (raw: string): string | null => {
  const value = raw.trim()
  if (!value) return null
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withScheme)
    return SAFE_PROTOCOLS.has(url.protocol) ? url.href : null
  } catch {
    return null
  }
}


export const kunChatMediaLabel = (media: KunChatMedia | { type: string } | null, t: KunTranslate) =>
  media?.type === 'photo' ? t('chat.photo') : t('chat.media')

/** One line of plain text standing for a message: its text, or what it
 *  carries. For screen-reader announcements and service messages. Spoilers
 *  become a mask here too — "pinned «…»" quoting a pinned spoiler gave it
 *  away. */
export const kunChatPlainText = (
  message: Pick<KunChatMessage, 'text' | 'media' | 'entities'>,
  t: KunTranslate
) => {
  if (!message.text) return message.media ? kunChatMediaLabel(message.media, t) : ''
  let text = message.text
  const spoilers = normalizeKunChatEntities(text, message.entities)
    .filter((e) => e.type === 'spoiler')
    .reverse()
  for (const { offset, length } of spoilers) {
    const size = Math.min(12, Math.max(3, Array.from(text.slice(offset, offset + length)).length))
    text = text.slice(0, offset) + '⠿'.repeat(size) + text.slice(offset + length)
  }
  return text
}

const truncate = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  const chars = Array.from(flat)
  return chars.length > max ? `${chars.slice(0, max).join('')}…` : flat
}

export interface KunChatServiceContext {
  users: ReadonlyMap<string, KunChatUser>
  currentUserId?: string | null
  t: KunTranslate
  locale: string
  resolveMessage?: (seq: number) => KunChatMessage | undefined
}

/** The sentence a service message stands for. */
export const kunChatServiceText = (message: KunChatMessage, ctx: KunChatServiceContext) => {
  const { t } = ctx
  const name = (id: string) =>
    id && id === ctx.currentUserId ? t('chat.you') : resolveKunChatUser(ctx.users, id, t).name
  const actor = name(message.sender_id)
  const action = message.service_action
  switch (action?.type) {
    case 'group_created':
      return action.title
        ? t('chatService.groupCreatedTitled', { actor, title: action.title })
        : t('chatService.groupCreated', { actor })
    case 'members_added': {
      if (action.user_ids.length === 1 && action.user_ids[0] === message.sender_id) {
        return t('chatService.memberJoined', { actor })
      }
      const users = new Intl.ListFormat(ctx.locale, { type: 'conjunction' }).format(
        action.user_ids.map(name)
      )
      return t('chatService.membersAdded', { actor, users })
    }
    case 'member_left':
      return t('chatService.memberLeft', { actor })
    case 'member_removed':
      return t('chatService.memberRemoved', { actor, user: name(action.user_id) })
    case 'title_changed':
      return t('chatService.titleChanged', { actor, title: action.title })
    case 'photo_changed':
      return t('chatService.photoChanged', { actor })
    case 'message_pinned': {
      const pinned = ctx.resolveMessage?.(action.seq)
      const text = pinned ? truncate(kunChatPlainText(pinned, t), 30) : ''
      return text
        ? t('chatService.messagePinned', { actor, text })
        : t('chatService.messagePinnedMedia', { actor })
    }
    case 'joined_by_link':
      return t('chatService.joinedByLink', { actor })
    default:
      return message.text
  }
}


/**
 * The `[start, end)` of the message text the current selection covers inside
 * `root`, in UTF-16 code units, or null. KunChatText marks each rendered run
 * of the message text with `data-kun-o` (its offset), so the mapping holds
 * even though the DOM carries more (a code block's header) and less (a line
 * break beside a block) than the text.
 */
export const kunChatSelectionRange = (root: HTMLElement): [number, number] | null => {
  const selection = typeof window === 'undefined' ? null : window.getSelection()
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null
  const range = selection.getRangeAt(0)
  const leaves = Array.from(root.querySelectorAll<HTMLElement>('[data-kun-o]')).filter((el) =>
    range.intersectsNode(el)
  )
  const first = leaves[0]
  const last = leaves[leaves.length - 1]
  if (!first || !last) return null
  const base = (el: HTMLElement) => Number(el.dataset.kunO)
  const length = (el: HTMLElement) => el.textContent?.length ?? 0
  // A boundary is either inside the leaf's text node (a character offset) or
  // on the leaf element itself (a child index: before or after its text).
  const point = (el: HTMLElement, node: Node, offset: number, outside: number) => {
    if (node.nodeType === Node.TEXT_NODE && el.contains(node)) return base(el) + offset
    if (node === el) return base(el) + (offset === 0 ? 0 : length(el))
    return outside
  }
  const start = point(first, range.startContainer, range.startOffset, base(first))
  const end = point(last, range.endContainer, range.endOffset, base(last) + length(last))
  return end > start ? [start, end] : null
}
