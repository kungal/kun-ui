import { randomNum } from '@kungal/ui-core'
import { KUN_LOLI_IMAGES } from '../assets/loliImages'

export interface KunLoliAsset {
  loli: string
  name: string
}

// Picks one of the bundled loli mascots at random (fresh per call). The image is
// an inlined base64 data URI — zero consumer setup, no network request.
export const getRandomLoli = (): KunLoliAsset => {
  const pick =
    KUN_LOLI_IMAGES[randomNum(0, KUN_LOLI_IMAGES.length - 1)] ?? KUN_LOLI_IMAGES[0]!
  return { name: pick.name, loli: pick.image }
}
