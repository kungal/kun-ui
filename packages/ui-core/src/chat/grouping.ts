import type { KunChatMessage } from './types.ts'
import { KUN_CHAT_ALBUM_LIMIT } from './constants.ts'

// The message list's row model, as data: day sections, sender groups, albums
// merged into one row, and the unread divider. The Vue list renders it, the
// Flutter port computes the same rows from the same function.

/** The row identity of a message: its `client_message_id` when it has one, so
 *  a pending message keeps its row when the server confirms it. */
export const kunChatMessageKey = (message: KunChatMessage): string =>
  message.client_message_id ? `c:${message.client_message_id}` : `m:${message.id}`

const pad = (n: number) => String(n).padStart(2, '0')

const dayFormatters = new Map<string, Intl.DateTimeFormat>()

/**
 * `YYYY-MM-DD` of an instant, in `timeZone` (an IANA name) or, when omitted,
 * the runtime's own zone. Keys sort chronologically as strings.
 */
export const kunChatDayKey = (date: Date, timeZone?: string): string => {
  if (!timeZone) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }
  let fmt = dayFormatters.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    dayFormatters.set(timeZone, fmt)
  }
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export type KunChatListRow =
  | { type: 'unread'; key: string }
  | { type: 'service'; key: string; message: KunChatMessage }
  | {
      type: 'message'
      key: string
      /** The message the row acts as: an album's first message with a
       *  caption, else its first; the message itself otherwise. */
      message: KunChatMessage
      /** Every message the row shows — an album's photos, in order. */
      messages: KunChatMessage[]
      own: boolean
      /** First of consecutive messages from one sender: the name goes here. */
      groupStart: boolean
      /** Last of the run: the avatar and the bubble tail go here. */
      groupEnd: boolean
    }

export interface KunChatDaySection {
  /** `YYYY-MM-DD` in the list's time zone. */
  key: string
  /** The first message's instant, for formatting the date pill. */
  date: Date
  rows: KunChatListRow[]
}

export interface KunChatGroupOptions {
  currentUserId: string
  /** The viewer's read cursor when the conversation was opened. The unread
   *  divider goes above the first later message someone else sent. */
  lastReadSeq?: number | null
  /** Longest gap, in seconds, inside one sender group. Default 600
   *  (telegram-tt's `GROUP_INTERVAL_SECONDS`). */
  groupWindow?: number
  /** IANA time zone for day boundaries; the runtime's zone when omitted. */
  timeZone?: string
}

const albumRepresentative = (messages: KunChatMessage[]) =>
  messages.find((m) => m.text) ?? messages[0]!

/**
 * Arrange messages — already in display order — into day sections and rows.
 * A sender group breaks on another sender, a new day, a gap longer than
 * `groupWindow`, the unread divider, and any service message.
 */
export const groupKunChatMessages = (
  messages: readonly KunChatMessage[],
  options: KunChatGroupOptions
): KunChatDaySection[] => {
  const windowMs = (options.groupWindow ?? 600) * 1000
  const sections: KunChatDaySection[] = []
  let dividerPlaced = options.lastReadSeq == null
  let prev: { sender: string; at: number; row: Extract<KunChatListRow, { type: 'message' }> } | null =
    null

  const closeGroup = () => {
    if (prev) prev.row.groupEnd = true
    prev = null
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]!
    const at = Date.parse(message.created_at)
    const date = new Date(Number.isNaN(at) ? 0 : at)
    const key = kunChatDayKey(date, options.timeZone)

    let section = sections[sections.length - 1]
    // Only ever forward: a pending message stamped by a slow local clock
    // joins the current day instead of reopening an earlier one.
    if (!section || key > section.key) {
      closeGroup()
      section = { key, date, rows: [] }
      sections.push(section)
    }

    const own = message.sender_id === options.currentUserId
    if (
      !dividerPlaced &&
      !own &&
      message.seq > options.lastReadSeq! &&
      message.seq > 0
    ) {
      closeGroup()
      section.rows.push({ type: 'unread', key: 'unread' })
      dividerPlaced = true
    }

    if (message.kind === 'service') {
      closeGroup()
      section.rows.push({ type: 'service', key: kunChatMessageKey(message), message })
      continue
    }

    let group = [message]
    if (message.media_group_id != null) {
      while (
        group.length < KUN_CHAT_ALBUM_LIMIT &&
        i + 1 < messages.length &&
        messages[i + 1]!.kind === 'message' &&
        messages[i + 1]!.media_group_id === message.media_group_id &&
        messages[i + 1]!.sender_id === message.sender_id
      ) {
        group = [...group, messages[++i]!]
      }
    }

    const continues =
      prev !== null && prev.sender === message.sender_id && at - prev.at <= windowMs
    if (!continues) closeGroup()

    const row: Extract<KunChatListRow, { type: 'message' }> = {
      type: 'message',
      key: kunChatMessageKey(message),
      message: group.length > 1 ? albumRepresentative(group) : message,
      messages: group,
      own,
      groupStart: !continues,
      groupEnd: false,
    }
    section.rows.push(row)
    const last = group[group.length - 1]!
    const lastAt = Date.parse(last.created_at)
    prev = { sender: message.sender_id, at: Number.isNaN(lastAt) ? at : lastAt, row }
  }
  closeGroup()
  return sections
}
