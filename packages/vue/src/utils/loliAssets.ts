import { randomNum } from '@kungal/ui-core'

export interface KunLoliAsset {
  loli: string
  name: string
}

// Picks one of the loli mascots at random (fresh per call). The image lives
// at `/alert/{name}.webp` in the consuming app's public dir.
const NAMES = ['あーちゃん', 'こじかひわ', '雪々', '琥珀'] as const

export const getRandomLoli = (): KunLoliAsset => {
  const name = NAMES[randomNum(0, NAMES.length - 1)] ?? NAMES[0]
  return { name, loli: `/alert/${name}.webp` }
}
