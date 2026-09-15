import { getCurrentInstance } from 'vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import zhCN from './zh-CN'
import type { KunLocale, KunMessagePath, KunMessages } from './types'

export type KunTranslate = (
  path: KunMessagePath,
  params?: Record<string, string | number>
) => string

export const translateKunMessage = (
  messages: KunMessages,
  path: KunMessagePath,
  params?: Record<string, string | number>
): string => {
  const [namespace, key] = path.split('.') as [keyof KunMessages, string]
  const group = messages[namespace] as Record<string, string> | undefined
  const template = group?.[key]

  if (typeof template !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[KunUI] no locale message at "${path}". A custom locale must supply every key in KunMessages.`
      )
    }
    return path
  }

  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (raw, name: string) =>
    params[name] === undefined ? raw : String(params[name])
  )
}

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
