import { decodeIfEncoded } from '@kungal/core'
import { useKunMessage } from './useKunMessage'

// Copy text to the clipboard and toast the result. Decodes percent-encoded
// input first so URLs read naturally in the toast. (Chinese copy matches the
// rest of the KunUI surface; messages go through the KunMessage store, so a
// <KunMessageProvider/> must be mounted.)
export const useKunCopy = (originText: string): void => {
  const text = decodeIfEncoded(originText)

  navigator.clipboard
    .writeText(text)
    .then(() => {
      useKunMessage(`${text} 复制成功`, 'success')
    })
    .catch(() => {
      useKunMessage(`${text} 复制失败! 请更换更现代的浏览器!`, 'error')
    })
}
