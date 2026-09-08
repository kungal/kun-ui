import { inject, provide, type App, type Component, type InjectionKey } from 'vue'
import { KUN_DEFAULT_ROUNDED, type KunUIRounded } from '@kungal/ui-core'

// Global KunUI defaults applied to every component in a Vue subtree (or the
// whole app if provided at root). Each component still accepts per-instance
// overrides via its own props — precedence:
//
//   per-instance prop  >  useKunUIConfig provider  >  built-in default
//
// Beyond `rounded`, this config is where KunUI decouples from Nuxt: the
// `linkComponent` / `iconComponent` slots let the host swap in NuxtLink /
// @nuxt/icon (done by @kungal/ui-nuxt) without the components hard-importing
// any Nuxt API. In a plain Vue app the link default is a native `<a>`, and
// icons render from the bundled registry (no injected icon component).
export interface KunUIConfig {
  /** Default border radius bucket for components that don't pass `rounded`
   *  and aren't shape-locked. */
  rounded: KunUIRounded

  /** Component rendered for navigational elements when an `href` is passed
   *  (Button, Card, …). Default `'a'`. A vue-router app can inject
   *  `RouterLink`; the Nuxt layer injects `NuxtLink`. KunUI passes the
   *  destination as `href` when this is a string tag, or as `to` when it is
   *  a component (matching RouterLink/NuxtLink convention). */
  linkComponent: Component | string

  /** Fallback renderer for icons NOT in the bundled/registered registry
   *  (KunIcon renders registry icons as inline SVG and never fetches).
   *  Default `null` → render nothing for unknown icons. The Nuxt layer sets
   *  this to a thin `@nuxt/icon` wrapper. The injected component receives a
   *  `name` prop holding an Iconify name (e.g. `'lucide:x'`). A string is
   *  treated as a globally-registered component tag. */
  iconComponent: Component | string | null

  /** Imperative navigation for components that navigate on interaction
   *  (e.g. Tab with an `href`). Default does a full-page
   *  `window.location.assign`. A vue-router app can inject
   *  `(href) => router.push(href)`; the Nuxt layer injects `navigateTo`.
   *  Return type is `unknown` so router helpers with polymorphic returns
   *  (Nuxt's `navigateTo`) assign cleanly; callers may `await` it. */
  navigate: (href: string) => unknown

  /** Path template KunAvatar navigates to on click. `{id}` is replaced with
   *  the user id. Default `/user/{id}/info`; override per app. */
  userLinkTemplate: string

  /** Images KunAvatar picks from for a user with no avatar. Default `[]` →
   *  every such user gets the bundled `KUN_AVATAR_FALLBACK` data URI.
   *
   *  Supply ABSOLUTE, immutable image URLs; KunUI never assembles one. The
   *  pick is `hash(user.name) % pool.length`, so the array is an index space,
   *  not a ranking: replace an entry in place to move only the users who land
   *  on it, and avoid changing its length, which re-assigns everyone.
   *
   *  In the NextMoe ecosystem the pool comes from sticker.kungal.com's
   *  `/api/v1/avatar-pool`, fetched by the host's SERVER (never per render,
   *  never by a browser) — most accounts have no avatar, so these are among
   *  the most-requested images anywhere and must stay a small, immutable,
   *  edge-cacheable set. */
  avatarFallbackPool: string[]

  /** Element/component KunImage renders for the actual image. Default
   *  `'img'` (native — KunImage keeps its skeleton/aspect/objectFit logic
   *  and passes only standard HTML img attributes). The Nuxt layer injects
   *  an `@nuxt/image` `<NuxtImg>` wrapper so the optimization props
   *  (provider/format/quality/densities/sizes/placeholder/preload) take
   *  effect; with the native default those props are omitted. */
  imageComponent: Component | string
}

const KUN_UI_CONFIG_KEY: InjectionKey<KunUIConfig> = Symbol('kun-ui-config')

// Built-in defaults — a plain `<a>` and Iconify, so KunUI works with zero
// configuration in any Vue app.
export const KUN_UI_DEFAULT_CONFIG: KunUIConfig = {
  rounded: KUN_DEFAULT_ROUNDED,
  linkComponent: 'a',
  iconComponent: null,
  navigate: (href: string) => {
    if (typeof window !== 'undefined') window.location.assign(href)
  },
  imageComponent: 'img',
  userLinkTemplate: '/user/{id}/info',
  avatarFallbackPool: [],
}

export const provideKunUIConfig = (config: Partial<KunUIConfig> = {}): void => {
  provide(KUN_UI_CONFIG_KEY, { ...KUN_UI_DEFAULT_CONFIG, ...config })
}

// App-level installer — same as provideKunUIConfig but for contexts where
// there is no active setup() (e.g. a Nuxt plugin that has the vueApp but
// not a component instance). `app.provide` makes the config visible to
// every KunUI component in the app, on both server and client.
//
// It MERGES over whatever a previous call installed instead of replacing it.
// `app.provide` is last-write-wins, so before this the @kungal/ui-nuxt layer
// plugin (linkComponent/iconComponent/imageComponent/navigate) and an app's
// own plugin could not both configure KunUI: whichever ran second silently
// reset the other's keys to the built-in defaults, turning every NuxtLink
// back into a full-page `<a>`. Order no longer matters; later keys win.
//
// The second call mutates the installed object rather than re-providing one.
// Re-providing the same key makes Vue log `App already provides property with
// key "Symbol(kun-ui-config)"` on every boot -- a warning aimed at a mistake,
// printed at what is now the supported pattern. Mutation is safe here because
// every caller is a plugin: they all run before the first render, and no
// component has read the object yet. This config is deliberately not
// reactive, so installing after mount was never supported either way.
export const installKunUIConfig = (
  app: App,
  config: Partial<KunUIConfig> = {}
): void => {
  const installed = app.runWithContext(() =>
    inject<KunUIConfig | undefined>(KUN_UI_CONFIG_KEY, undefined)
  )
  if (installed) {
    Object.assign(installed, config)
    return
  }
  app.provide(KUN_UI_CONFIG_KEY, { ...KUN_UI_DEFAULT_CONFIG, ...config })
}

export const useKunUIConfig = (): KunUIConfig =>
  inject(KUN_UI_CONFIG_KEY, KUN_UI_DEFAULT_CONFIG)
