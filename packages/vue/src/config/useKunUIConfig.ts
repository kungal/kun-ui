import { inject, provide, type App, type Component, type InjectionKey } from 'vue'
import { KUN_DEFAULT_ROUNDED, type KunUIRounded } from '@kun/core'

// Global KunUI defaults applied to every component in a Vue subtree (or the
// whole app if provided at root). Each component still accepts per-instance
// overrides via its own props — precedence:
//
//   per-instance prop  >  useKunUIConfig provider  >  built-in default
//
// Beyond `rounded`, this config is where KunUI decouples from Nuxt: the
// `linkComponent` / `iconComponent` slots let the host swap in NuxtLink /
// @nuxt/icon (done by @kun/ui-nuxt) without the components hard-importing
// any Nuxt API. In a plain Vue app the defaults are a native `<a>` and
// `@iconify/vue`.
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

  /** Component rendered for icons. Default `null` → `@iconify/vue`. The Nuxt
   *  layer injects `@nuxt/icon` (via a thin wrapper). The injected component
   *  receives a `name` prop holding an Iconify name (e.g. `'lucide:x'`). A
   *  string is treated as a globally-registered component tag. */
  iconComponent: Component | string | null
}

const KUN_UI_CONFIG_KEY: InjectionKey<KunUIConfig> = Symbol('kun-ui-config')

// Built-in defaults — a plain `<a>` and Iconify, so KunUI works with zero
// configuration in any Vue app.
export const KUN_UI_DEFAULT_CONFIG: KunUIConfig = {
  rounded: KUN_DEFAULT_ROUNDED,
  linkComponent: 'a',
  iconComponent: null,
}

export const provideKunUIConfig = (config: Partial<KunUIConfig> = {}): void => {
  provide(KUN_UI_CONFIG_KEY, { ...KUN_UI_DEFAULT_CONFIG, ...config })
}

// App-level installer — same as provideKunUIConfig but for contexts where
// there is no active setup() (e.g. a Nuxt plugin that has the vueApp but
// not a component instance). `app.provide` makes the config visible to
// every KunUI component in the app, on both server and client.
export const installKunUIConfig = (
  app: App,
  config: Partial<KunUIConfig> = {}
): void => {
  app.provide(KUN_UI_CONFIG_KEY, { ...KUN_UI_DEFAULT_CONFIG, ...config })
}

export const useKunUIConfig = (): KunUIConfig =>
  inject(KUN_UI_CONFIG_KEY, KUN_UI_DEFAULT_CONFIG)
