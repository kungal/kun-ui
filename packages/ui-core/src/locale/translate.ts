import type { KunMessagePath, KunMessages } from './types'

// Resolve one message and substitute its `{name}` placeholders. Framework-free
// on purpose: each render layer binds it to however that layer holds the
// active locale.
//
// A `{name}` with no matching param is left as written rather than blanked —
// a missing interpolation should be visible in the UI, not silently produce a
// half-sentence.
export const translateKunMessage = (
  messages: KunMessages,
  path: KunMessagePath,
  params?: Record<string, string | number>
): string => {
  const [namespace, key] = path.split('.') as [keyof KunMessages, string]
  const group = messages[namespace] as Record<string, string> | undefined
  const template = group?.[key]

  if (typeof template !== 'string') {
    // NODE_ENV, not import.meta.env.DEV: Vite folds the latter to false when it
    // builds a consuming package, which strips the warning from the bundle.
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
