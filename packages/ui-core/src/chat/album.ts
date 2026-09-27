// Telegram's album mosaic, ported from Telegram Desktop's grouped_layout.cpp
// by way of tweb's groupedLayout.ts, constant for constant. Not telegram-tt's
// copy: it passes a maxHeight into the 5+ case, so the 4/3 target height
// never applies and five photos lay out differently from every other client.
//
// The output is in layout units; a renderer divides by `width` / `height` and
// places each tile by percentage, so the mosaic scales to any bubble width
// with no measuring.

export interface KunChatAlbumSize {
  width: number
  height: number
}

/** Which outer edges of the mosaic a tile touches — its rounded corners. */
export const KUN_CHAT_ALBUM_SIDE = {
  top: 1,
  right: 2,
  bottom: 4,
  left: 8,
} as const

export interface KunChatAlbumTile {
  x: number
  y: number
  width: number
  height: number
  /** Bitmask of `KUN_CHAT_ALBUM_SIDE`. */
  sides: number
}

export interface KunChatAlbumLayout {
  width: number
  height: number
  tiles: KunChatAlbumTile[]
}

export interface KunChatAlbumOptions {
  /** Default 420, tweb's desktop bubble width. */
  maxWidth?: number
  /** Narrowest tile. Default 100. */
  minWidth?: number
  /** Gap between tiles. Default 2. */
  spacing?: number
}

const { top: T, right: R, bottom: B, left: L } = KUN_CHAT_ALBUM_SIDE
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

const tile = (x: number, y: number, width: number, height: number, sides: number) => ({
  x,
  y,
  width,
  height,
  sides,
})

const layoutComplex = (
  ratios: number[],
  averageRatio: number,
  maxWidth: number,
  minWidth: number,
  spacing: number
): KunChatAlbumTile[] => {
  const maxHeight = (maxWidth * 4) / 3
  const cropped = ratios.map((r) =>
    averageRatio > 1.1 ? clamp(r, 1, 2.75) : clamp(r, 0.6667, 1)
  )
  const count = cropped.length
  const attempts: { counts: number[]; heights: number[] }[] = []
  const push = (counts: number[]) => {
    let offset = 0
    const heights = counts.map((c) => {
      const h = (maxWidth - (c - 1) * spacing) / sum(cropped.slice(offset, offset + c))
      offset += c
      return h
    })
    attempts.push({ counts, heights })
  }

  for (let first = 1; first !== count; first++) {
    const second = count - first
    if (first <= 3 && second <= 3) push([first, second])
  }
  for (let first = 1; first < count - 1; first++) {
    for (let second = 1; second < count - first; second++) {
      const third = count - first - second
      if (first <= 3 && second <= (averageRatio < 0.85 ? 4 : 3) && third <= 3) {
        push([first, second, third])
      }
    }
  }
  for (let first = 1; first < count - 1; first++) {
    for (let second = 1; second < count - first; second++) {
      for (let third = 1; third < count - first - second; third++) {
        const fourth = count - first - second - third
        if (first <= 3 && second <= 3 && third <= 3 && fourth <= 3) {
          push([first, second, third, fourth])
        }
      }
    }
  }

  // More than 12 photos leave no split of rows of at most three (tweb throws
  // there). Albums hold 10, but a bad row must render: fall back to rows of
  // three.
  if (!attempts.length) {
    push(Array.from({ length: Math.ceil(count / 3) }, (_, i) => Math.min(3, count - i * 3)))
  }
  let best = attempts[0]!
  let bestDiff = Infinity
  for (const attempt of attempts) {
    const { counts, heights } = attempt
    const total = sum(heights) + spacing * (counts.length - 1)
    const tooShort = Math.min(...heights) < minWidth ? 1.5 : 1
    const topHeavy = counts.some((c, i) => i > 0 && counts[i - 1]! > c) ? 1.5 : 1
    const diff = Math.abs(total - maxHeight) * tooShort * topHeavy
    if (diff < bestDiff) {
      best = attempt
      bestDiff = diff
    }
  }

  const tiles: KunChatAlbumTile[] = []
  let index = 0
  let y = 0
  best.counts.forEach((cols, row) => {
    const lineHeight = best.heights[row]!
    const height = Math.round(lineHeight)
    let x = 0
    for (let col = 0; col < cols; col++) {
      const sides =
        (row === 0 ? T : 0) |
        (row === best.counts.length - 1 ? B : 0) |
        (col === 0 ? L : 0) |
        (col === cols - 1 ? R : 0)
      const width =
        col === cols - 1 ? maxWidth - x : Math.round(cropped[index]! * lineHeight)
      tiles.push(tile(x, y, width, height, sides))
      x += width + spacing
      index++
    }
    y += height + spacing
  })
  return tiles
}

/**
 * Lay out an album of 1–10 photos as Telegram does. Sizes with a zero or
 * missing side are treated as square.
 */
export const layoutKunChatAlbum = (
  sizes: readonly KunChatAlbumSize[],
  options: KunChatAlbumOptions = {}
): KunChatAlbumLayout => {
  const maxWidth = options.maxWidth ?? 420
  const minWidth = options.minWidth ?? 100
  const s = options.spacing ?? 2
  const maxHeight = maxWidth
  const r = sizes.map((z) => (z.width > 0 && z.height > 0 ? z.width / z.height : 1))
  const n = r.length
  const shape = r.map((x) => (x > 1.2 ? 'w' : x < 0.8 ? 'n' : 'q')).join('')
  // The `+ 1` is in Telegram Desktop too.
  const averageRatio = (1 + sum(r)) / n
  const maxSizeRatio = maxWidth / maxHeight

  let tiles: KunChatAlbumTile[]
  if (n === 0) {
    tiles = []
  } else if (n === 1) {
    tiles = [tile(0, 0, maxWidth, maxWidth / r[0]!, T | R | B | L)]
  } else if (n >= 5 || r.some((x) => x > 2)) {
    tiles = layoutComplex(r, averageRatio, maxWidth, minWidth, s)
  } else if (n === 2) {
    const [r0, r1] = r as [number, number]
    if (shape === 'ww' && averageRatio > 1.4 * maxSizeRatio && r1 - r0 < 0.2) {
      const h = Math.round(Math.min(maxWidth / r0, maxWidth / r1, (maxHeight - s) / 2))
      tiles = [tile(0, 0, maxWidth, h, L | T | R), tile(0, h + s, maxWidth, h, L | B | R)]
    } else if (shape === 'ww' || shape === 'qq') {
      const w = (maxWidth - s) / 2
      const h = Math.round(Math.min(w / r0, w / r1, maxHeight))
      tiles = [tile(0, 0, w, h, T | L | B), tile(w + s, 0, w, h, T | R | B)]
    } else {
      const w2 = Math.min(
        Math.round(Math.max(0.4 * (maxWidth - s), (maxWidth - s) / r0 / (1 / r0 + 1 / r1))),
        maxWidth - s - Math.round(minWidth * 1.5)
      )
      const w1 = maxWidth - w2 - s
      const h = Math.min(maxHeight, Math.round(Math.min(w1 / r0, w2 / r1)))
      tiles = [tile(0, 0, w1, h, T | L | B), tile(w1 + s, 0, w2, h, T | R | B)]
    }
  } else if (n === 3) {
    const [r0, r1, r2] = r as [number, number, number]
    if (shape[0] === 'n') {
      const h0 = maxHeight
      const h2 = Math.round(Math.min((maxHeight - s) / 2, (r1 * (maxWidth - s)) / (r2 + r1)))
      const h1 = h0 - h2 - s
      const wR = Math.max(minWidth, Math.round(Math.min((maxWidth - s) / 2, h2 * r2, h1 * r1)))
      const wL = Math.min(Math.round(h0 * r0), maxWidth - s - wR)
      tiles = [
        tile(0, 0, wL, h0, T | L | B),
        tile(wL + s, 0, wR, h1, T | R),
        tile(wL + s, h1 + s, wR, h2, B | R),
      ]
    } else {
      const h0 = Math.round(Math.min(maxWidth / r0, (maxHeight - s) * 0.66))
      const w1 = (maxWidth - s) / 2
      const h1 = Math.min(maxHeight - h0 - s, Math.round(Math.min(w1 / r1, w1 / r2)))
      const w2 = maxWidth - w1 - s
      tiles = [
        tile(0, 0, maxWidth, h0, L | T | R),
        tile(0, h0 + s, w1, h1, B | L),
        tile(w1 + s, h0 + s, w2, h1, B | R),
      ]
    }
  } else {
    const [r0, r1, r2, r3] = r as [number, number, number, number]
    if (shape[0] === 'w') {
      const h0 = Math.round(Math.min(maxWidth / r0, (maxHeight - s) * 0.66))
      const h = Math.round((maxWidth - 2 * s) / (r1 + r2 + r3))
      const w0 = Math.max(minWidth, Math.round(Math.min((maxWidth - 2 * s) * 0.4, h * r1)))
      const w2 = Math.round(Math.max(minWidth, (maxWidth - 2 * s) * 0.33, h * r3))
      const w1 = maxWidth - w0 - w2 - 2 * s
      const h1 = Math.min(maxHeight - h0 - s, h)
      tiles = [
        tile(0, 0, maxWidth, h0, L | T | R),
        tile(0, h0 + s, w0, h1, B | L),
        tile(w0 + s, h0 + s, w1, h1, B),
        tile(w0 + s + w1 + s, h0 + s, w2, h1, R | B),
      ]
    } else {
      const h = maxHeight
      const w0 = Math.round(Math.min(h * r0, (maxWidth - s) * 0.6))
      const w = Math.round((maxHeight - 2 * s) / (1 / r1 + 1 / r2 + 1 / r3))
      const h0 = Math.round(w / r1)
      const h1 = Math.round(w / r2)
      const h2 = h - h0 - h1 - 2 * s
      const w1 = Math.max(minWidth, Math.min(maxWidth - w0 - s, w))
      tiles = [
        tile(0, 0, w0, h, T | L | B),
        tile(w0 + s, 0, w1, h0, T | R),
        tile(w0 + s, h0 + s, w1, h1, R),
        tile(w0 + s, h0 + h1 + 2 * s, w1, h2, B | R),
      ]
    }
  }

  return {
    width: Math.max(0, ...tiles.map((t) => t.x + t.width)),
    height: Math.max(0, ...tiles.map((t) => t.y + t.height)),
    tiles,
  }
}
