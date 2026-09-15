import { decodeIfEncoded } from '@kungal/ui-core'
import { useKunMessage } from './useKunMessage'
import { translateKunMessage } from '../locale/useKunLocale'
import kunZhCN from '../locale/zh-CN'

export interface KunCopyMessages {
  /** Toast on success. Already interpolated — no `{text}` placeholder left. */
  success?: string
  /** Toast on failure. Already interpolated. */
  error?: string
}

// Copy text to the clipboard and toast the result. Decodes percent-encoded
// input first so URLs read naturally in the toast. (Messages go through the
// KunMessage store, so a <KunMessageProvider/> must be mounted.)
//
// Returns whether the copy succeeded, so callers can drive their own success
// affordance (e.g. KunCopy's "已复制" state) off the REAL result — clipboard
// writes reject in insecure contexts / older browsers / unfocused documents,
// and `navigator.clipboard` can be undefined entirely.
//
// This runs from an event handler, not setup(), so it cannot inject the app's
// locale. KunCopy resolves the two toasts against it and passes them in;
// call it the same way if your app is not on the built-in zh-CN.
export const useKunCopy = async (
  originText: string,
  messages: KunCopyMessages = {}
): Promise<boolean> => {
  const text = decodeIfEncoded(originText)

  try {
    if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(text)
    useKunMessage(
      messages.success ??
        translateKunMessage(kunZhCN.messages, 'copy.success', { text }),
      'success'
    )
    return true
  } catch {
    useKunMessage(
      messages.error ??
        translateKunMessage(kunZhCN.messages, 'copy.failure', { text }),
      'error'
    )
    return false
  }
}
