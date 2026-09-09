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
  id: number
  name: string
  avatar: string
}
