import { getCurrentInstance, onMounted, readonly, ref, type Ref } from 'vue'
import type { KunShortcutPlatform } from '@kungal/ui-core'

// The server cannot know the client's keyboard, so it renders the non-Apple
// form and hydration must match it; a Mac switches to ⌘ once mounted. The
// detected value is cached so a component created later — a menu or tooltip
// opening — starts on the right platform instead of flashing Ctrl for a frame.
// Only the client ever writes the cache.
let detected: KunShortcutPlatform | null = null

const detect = (): KunShortcutPlatform => {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent
  return /mac|iphone|ipad|ipod/i.test(platform) ? 'apple' : 'other'
}

/** The platform keyboard shortcuts are shown for: `apple` (⌘) or `other`
 *  (Ctrl). `other` on the server and during hydration. */
export const useKunShortcutPlatform = (): Readonly<Ref<KunShortcutPlatform>> => {
  // A lazily hydrated subtree (Nuxt's hydrate-on-visible, an async component)
  // hydrates after the cache is set, against the server's `other` HTML. Vue
  // assigns vnode.el before setup only when hydrating (runtime-core 3.5.35).
  const hydrating = !!getCurrentInstance()?.vnode.el
  const platform = ref<KunShortcutPlatform>(hydrating ? 'other' : (detected ?? 'other'))
  onMounted(() => {
    detected ??= detect()
    platform.value = detected
  })
  return readonly(platform)
}
