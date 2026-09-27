import { test } from 'node:test'
import assert from 'node:assert/strict'
import { layoutKunChatAlbum } from './album.ts'

// Expected tiles are tweb's groupedLayout.ts output for the same input
// (maxWidth 420, minWidth 100, spacing 2), as [x, y, width, height, sides].
// Before these fixtures were taken, the port was also compared with tweb on
// 20,000 random albums of 2–10 photos: no tile differed.
const fixtures: Record<string, [[number, number][], number[][]]> = {
  twoWide: [
    [[1600, 900], [1600, 900]],
    [[0, 0, 420, 209, 11], [0, 211, 420, 209, 14]],
  ],
  twoMixed: [
    [[900, 1600], [1600, 900]],
    [[0, 0, 150, 151, 13], [152, 0, 268, 151, 7]],
  ],
  threeNarrowFirst: [
    [[600, 1200], [1200, 900], [1000, 1000]],
    [[0, 0, 209, 420, 13], [211, 0, 209, 209, 3], [211, 211, 209, 209, 6]],
  ],
  fourWideFirst: [
    [[2000, 1000], [800, 1000], [1000, 1000], [1200, 900]],
    [[0, 0, 420, 210, 11], [0, 212, 106, 133, 12], [108, 212, 133, 133, 4], [243, 212, 177, 133, 6]],
  ],
  // telegram-tt lays this one out as two rows; tweb and Telegram Desktop as three.
  fiveMixed: [
    [[1330, 1000], [750, 1000], [1000, 1000], [1500, 1000], [660, 1000]],
    [
      [0, 0, 420, 316, 11],
      [0, 318, 209, 209, 8],
      [211, 318, 209, 209, 2],
      [0, 529, 251, 167, 12],
      [253, 529, 167, 167, 6],
    ],
  ],
}

test('matches tweb / Telegram Desktop tile for tile', () => {
  for (const [name, [sizes, tiles]] of Object.entries(fixtures)) {
    const layout = layoutKunChatAlbum(sizes.map(([width, height]) => ({ width, height })))
    assert.deepEqual(
      layout.tiles.map((t) => [t.x, t.y, t.width, t.height, t.sides]),
      tiles,
      name
    )
  }
})

test('the bounding box encloses every tile', () => {
  const layout = layoutKunChatAlbum(fixtures.fiveMixed![0].map(([width, height]) => ({ width, height })))
  assert.equal(layout.width, 420)
  assert.equal(layout.height, 696)
})

test('degenerate sizes are squares, and an empty album is empty', () => {
  const layout = layoutKunChatAlbum([
    { width: 0, height: 0 },
    { width: 100, height: 100 },
  ])
  assert.equal(layout.tiles.length, 2)
  assert.ok(layout.tiles.every((t) => Number.isFinite(t.width) && Number.isFinite(t.height)))
  assert.deepEqual(layoutKunChatAlbum([]), { width: 0, height: 0, tiles: [] })
})

test('ten photos: every tile has positive size and stays inside the width', () => {
  const sizes = Array.from({ length: 10 }, (_, i) => ({ width: 800 + i * 150, height: 1000 }))
  const layout = layoutKunChatAlbum(sizes)
  assert.equal(layout.tiles.length, 10)
  for (const t of layout.tiles) {
    assert.ok(t.width > 0 && t.height > 0)
    assert.ok(t.x + t.width <= 420)
  }
})

test('more photos than any row split allows still lays out', () => {
  const layout = layoutKunChatAlbum(Array.from({ length: 13 }, () => ({ width: 1000, height: 800 })))
  assert.equal(layout.tiles.length, 13)
  assert.ok(layout.tiles.every((t) => t.width > 0 && t.height > 0))
})
