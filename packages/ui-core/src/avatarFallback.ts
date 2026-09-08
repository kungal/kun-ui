import { KUN_AVATAR_FALLBACK } from './avatarFallbackImage'

// The predecessor of this file hardcoded `https://sticker.kungal.com` plus a
// `/stickers/KUNgal{pack}/{n}.webp` path and a pack/per-pack count. That path
// addressed a POSITION IN A MUTABLE COLLECTION on a site KunUI does not own,
// so when that site stopped serving static files every avatar-less account
// across six consumers 404'd at once. A URL that names another service does
// not belong in a component library: the host supplies the pool
// (`useKunUIConfig().avatarFallbackPool`), KunUI only chooses from it.

const hash = (value: string): number => {
  let h = 0
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(h, 31) + value.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Deterministically pick one image from an avatar fallback pool.
 *
 * The same `seed` always yields the same entry on server and client, so there
 * is no hydration mismatch and no framework state is needed.
 *
 * `pool` is treated as a FIXED-LENGTH array: the index is
 * `hash(seed) % pool.length`, so adding or removing an entry re-assigns every
 * seed, while replacing one entry in place moves only the seeds that land on
 * it. Pool providers should edit slots rather than resize.
 *
 * An empty pool returns the bundled data URI, which cannot fail to load.
 */
export const pickAvatarFallback = (seed = '', pool: readonly string[] = []): string =>
  pool.length > 0 ? (pool[hash(seed) % pool.length] ?? KUN_AVATAR_FALLBACK) : KUN_AVATAR_FALLBACK

/**
 * @deprecated Renamed to `pickAvatarFallback`, which takes the pool the host
 * configured. This alias no longer returns a sticker URL — it returns the
 * bundled fallback for any input, because the host it used to point at stopped
 * serving those files. Pass a pool, or read the resolved image off KunAvatar.
 */
export const getRandomSticker = (id = ''): string => pickAvatarFallback(id)
