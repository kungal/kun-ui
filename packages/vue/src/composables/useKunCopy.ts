import { decodeIfEncoded } from '@kungal/ui-core'
import { useKunMessage } from './useKunMessage'

// Copy text to the clipboard and toast the result. Decodes percent-encoded
// input first so URLs read naturally in the toast. (Chinese copy matches the
// rest of the KunUI surface; messages go through the KunMessage store, so a
// <KunMessageProvider/> must be mounted.)
//
// Returns whether the copy succeeded, so callers can drive their own success
// affordance (e.g. KunCopy's "已复制" state) off the REAL result — clipboard
// writes reject in insecure contexts / older browsers / unfocused documents,
// and `navigator.clipboard` can be undefined entirely.
export const useKunCopy = async (originText: string): Promise<boolean> => {
  const text = decodeIfEncoded(originText)

  try {
    if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(text)
    useKunMessage(`${text} 复制成功`, 'success')
    return true
  } catch {
    useKunMessage(`${text} 复制失败! 请更换更现代的浏览器!`, 'error')
    return false
  }
}
