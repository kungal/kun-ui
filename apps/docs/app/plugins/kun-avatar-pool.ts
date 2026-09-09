import { installKunUIConfig } from '@kungal/ui-vue'

// Give KunAvatar a pool to pick from. Without this every user with no avatar
// image renders the same bundled KUN_AVATAR_FALLBACK data URI: `pickAvatarFallback`
// reads an empty pool as "no choice to make" and returns the terminal fallback
// for every seed, silently.
//
// Installed app-wide and synchronously from a bundled constant, so server and
// client resolve the identical array and therefore the identical
// `hash(name) % pool.length` — no payload, no await, no hydration mismatch. An
// SSR app that wants a live pool needs the fetch + `useState` recipe instead;
// docs/INTEGRATION.md §7.1 has it, and app/utils/avatarPool.ts says why this
// prerendered site does not use it.
export default defineNuxtPlugin((nuxtApp) => {
  installKunUIConfig(nuxtApp.vueApp, { avatarFallbackPool: KUN_AVATAR_POOL })
})
