// The NextMoe chat wire shapes (`/v2/chat`), verbatim — snake_case included.
// The chat components take these objects exactly as the API returns them, so
// no site writes a conversion layer, and the Flutter port reads the same JSON.
// That is why this file breaks KunUI's camelCase convention.
//
// Every id is a decimal string, as everywhere in `/v2` (they are 64-bit and
// would not survive a JavaScript number); positions and counts are numbers.

export type KunChatEntityType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'spoiler'
  | 'code'
  | 'pre'
  | 'blockquote'
  | 'text_link'
  | 'mention'
  | 'url'

/**
 * A formatting range over a message's text. `offset` and `length` count
 * UTF-16 code units, as JavaScript string indices and Dart strings do, so a
 * range is `text.slice(offset, offset + length)` on both platforms.
 */
export interface KunChatEntity {
  type: KunChatEntityType
  offset: number
  length: number
  /** `mention` only: the mentioned user. */
  user_id?: string
  /** `text_link` only: the link target. */
  url?: string
  /** `pre` only: the code block's language, e.g. `go`. */
  language?: string
}

export interface KunChatPhoto {
  type: 'photo'
  /** Image-service hash. The site turns it into a URL; KunUI never builds one. */
  image_hash: string
  width: number
  height: number
  thumbhash?: string | null
}

/** Media attached to a message. Only `photo` exists today; sticker and file
 *  arrive later, and every consumer switches on `type`. */
export type KunChatMedia = KunChatPhoto

/** The message a reply points at, embedded by the server so a reply renders
 *  without fetching its target. */
export interface KunChatReplyTo {
  seq: number
  sender_id: string
  text: string
  entities: KunChatEntity[]
  /** The replied-to message's `media.type`, or null. */
  media_type: string | null
  /** The target was deleted for everyone; render "message deleted". */
  deleted: boolean
}

/** A reply that quotes only part of its target. `offset` is where the quote
 *  starts in the target's text, in UTF-16 code units. */
export interface KunChatReplyQuote {
  text: string
  entities: KunChatEntity[]
  offset: number
}

export type KunChatServiceAction =
  | { type: 'group_created'; title?: string }
  | { type: 'members_added'; user_ids: string[] }
  | { type: 'member_left' }
  | { type: 'member_removed'; user_id: string }
  | { type: 'title_changed'; title: string }
  | { type: 'photo_changed' }
  | { type: 'message_pinned'; seq: number }
  | { type: 'joined_by_link' }

export type KunChatServiceActionType = KunChatServiceAction['type']

/** A cross-site context card, e.g. "sent from the moyu page of patch X". */
export interface KunChatContext {
  site: string
  kind: string
  id: string
  title: string
  url: string
}

export interface KunChatReaction {
  /** A key from the reaction vocabulary, never an emoji character. */
  reaction: string
  count: number
  /** Whether the viewer is one of `count`. */
  reacted: boolean
}

/** One entry of the reaction vocabulary served by `GET /v2/chat/reactions`. */
export interface KunChatReactionOption {
  key: string
  /** Native emoji, shown when there is no `image_url`. */
  emoji: string
  /** Accessible name, e.g. "爱心". */
  label: string
  /** Animated image to draw instead of the emoji. */
  image_url?: string | null
}

/** Client-side delivery state of a message the viewer sent. */
export type KunChatSendStatus = 'sending' | 'sent' | 'read' | 'failed'

export interface KunChatMessage {
  object?: 'message'
  id: string
  conversation_id: string
  /** Position in the conversation, from 1, gap-free. */
  seq: number
  sender_id: string
  kind: 'message' | 'service'
  text: string
  entities: KunChatEntity[]
  media: KunChatMedia | null
  /** Photos sent together share one value; each photo is its own message. */
  media_group_id: string | null
  reply_to: KunChatReplyTo | null
  reply_quote: KunChatReplyQuote | null
  service_action: KunChatServiceAction | null
  context: KunChatContext | null
  reactions: KunChatReaction[]
  silent: boolean
  pinned_at: string | null
  edited_at: string | null
  created_at: string
  /** Local only: the idempotency key a pending message was sent with. Kept on
   *  the confirmed message, it keeps the row's identity across confirmation. */
  client_message_id?: string | null
  /** Local only: the delivery state of the viewer's own message. When absent
   *  it is derived — `read` at or below the peer's read cursor, else `sent`. */
  status?: KunChatSendStatus
}

/** The result of parsing composer input, and what a send carries. */
export interface KunChatFormattedText {
  text: string
  entities: KunChatEntity[]
}

/** A member of the `users` array chat responses carry. A deleted account keeps
 *  its id with an empty name and `deleted: true`; the components render it as
 *  "deleted account" with the fallback avatar. Not a `KunUser`: that one's id
 *  is a number, this one's a string. */
export interface KunChatUser {
  object?: 'user'
  id: string
  name: string
  avatar: string
  deleted?: boolean
}

/** A typing notification as the site received it. `at` is the receiving
 *  client's own clock (`Date.now()`), never the server's, so the 6-second
 *  expiry is immune to clock skew. */
export interface KunChatTypingEvent {
  user_id: string
  at: number
}
