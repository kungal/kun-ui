// Chat limits and timings shared with the server and the Flutter port.

/** Longest message text, in UTF-16 code units (Telegram's value). */
export const KUN_CHAT_TEXT_LIMIT = 4096
/** Most photos one album can hold. */
export const KUN_CHAT_ALBUM_LIMIT = 10
/** A client sends at most one typing notification per this many ms. */
export const KUN_CHAT_TYPING_INTERVAL = 5000
/** A typing notification not renewed within this many ms has expired. */
export const KUN_CHAT_TYPING_TIMEOUT = 6000
