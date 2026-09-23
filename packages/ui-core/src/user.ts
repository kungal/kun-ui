// Minimal user "brief" needed to render an avatar / user chip. The widest
// useful common denominator across consuming apps; a consumer's richer User
// type is structurally assignable as long as it has these fields.
//
// `avatar` is a URL, rendered exactly as given: KunAvatar does NOT derive size
// variants from it (which thumbnail to request is the consumer's business — it
// knows its image host's convention). Empty → `pickAvatarFallback(name, pool)`
// over the host's configured `avatarFallbackPool`. Both of those were once
// otherwise, and this comment described the old behaviour for a release.
export interface KunUser {
  /**
   * `0` means there is no profile to link to — an unknown or deleted author,
   * a signed-out viewer. KunAvatar and KunUserChip render it without a link.
   */
  id: number
  name: string
  avatar: string
  /**
   * An avatar frame drawn around the avatar (NextMoe `cosmetics.avatar_frame`).
   * Absent or null → no frame.
   */
  avatarDecoration?: KunAvatarDecoration | null
}

/**
 * A frame asset on a square canvas 1.2× the avatar, the avatar circle centred
 * in it. `src` is the still image; `animatedSrc`, when present, is played on
 * hover or always, depending on KunAvatar's `decoration`.
 */
export interface KunAvatarDecoration {
  src: string
  animatedSrc?: string
}
