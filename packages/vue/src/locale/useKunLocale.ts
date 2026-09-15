import { getCurrentInstance } from 'vue'
import { translateKunMessage } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import zhCN from './zh-CN'
import type { KunTranslate } from '@kungal/ui-core'
import type { KunLocale } from './types'

// Re-exported so a consumer already on @kungal/ui-vue never has to add
// @kungal/ui-core to reach the resolver.
export { translateKunMessage }
export type { KunTranslate }

// Resolves KunUI's own strings. The locale lives on the KunUI config, so it is
// per-app (per-request under SSR) rather than module-global — a module-level
// `Locale.use()` would leak one request's language into another's HTML.
//
// Like the rest of useKunUIConfig this is NOT reactive: it is read once where
// it is called. Swapping language at runtime means re-providing the config and
// re-keying the subtree.
export const useKunLocale = (): { locale: KunLocale; t: KunTranslate } => {
  // `inject` is setup-only, and these composables are also called from event
  // handlers (useFilePicker from a click). Skipping it there avoids Vue's
  // "inject() can only be used inside setup()" warning; the caller gets the
  // built-in locale, same as before locales existed.
  const locale = getCurrentInstance() ? useKunUIConfig().locale : zhCN

  return {
    locale,
    t: (path, params) => translateKunMessage(locale.messages, path, params),
  }
}
