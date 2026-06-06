// Decode a possibly percent-encoded string, returning the original when it
// is not encoded (or when decoding throws on malformed input).
export const decodeIfEncoded = (text: string): string => {
  try {
    const decoded = decodeURIComponent(text)
    return decoded !== text ? decoded : text
  } catch {
    return text
  }
}
