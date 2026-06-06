// Deterministic sticker picker for fallback/empty states (avatars without
// an image, KunNull's empty illustration, etc.).
//
// The original was random-per-call + Nuxt `useState` to freeze the pick
// across SSR hydration. This version derives the URL deterministically from
// the `id` (a cheap string hash) instead: the same id always yields the same
// sticker on both server and client, so there is no hydration mismatch and
// no framework state needed — fully portable.
//
// The CDN is the KunUI sticker host; consumers don't need to ship assets.

const KUN_STICKER_DOMAIN = 'https://sticker.kungal.com'
const PACKS = 5
const PER_PACK = 80

const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0
  }
  return h
}

export const getRandomSticker = (id = ''): string => {
  const h = hash(id)
  const pack = (h % PACKS) + 1
  const sticker = (Math.floor(h / PACKS) % PER_PACK) + 1
  return `${KUN_STICKER_DOMAIN}/stickers/KUNgal${pack}/${sticker}.webp`
}
