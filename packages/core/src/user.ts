// Minimal user "brief" needed to render an avatar / user chip. The widest
// useful common denominator across consuming apps; a consumer's richer User
// type is structurally assignable as long as it has these fields.
//
// `avatar` is a URL; KunAvatar swaps a `.webp` suffix to a `-100.webp`
// thumbnail for non-original sizes, and falls back to a deterministic
// sticker (getRandomSticker) when it's empty.
export interface KunUser {
  id: number
  name: string
  avatar: string
}
