import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveKunSplitSize } from './splitPane.ts'

const range = { min: 240, max: 480 }
const snaps = { ...range, snapPoints: [360, 412] }

test('clamps into [min, max]', () => {
  assert.equal(resolveKunSplitSize(100, range), 240)
  assert.equal(resolveKunSplitSize(900, range), 480)
  assert.equal(resolveKunSplitSize(300, range), 300)
})

test('rounds to a whole pixel', () => {
  assert.equal(resolveKunSplitSize(300.4, range), 300)
  assert.equal(resolveKunSplitSize(300.6, range), 301)
})

test('a swapped min and max still clamps', () => {
  assert.equal(resolveKunSplitSize(100, { min: 480, max: 240 }), 240)
})

test('snaps within the threshold (default 8), not beyond it', () => {
  assert.equal(resolveKunSplitSize(365, snaps), 360)
  assert.equal(resolveKunSplitSize(352, snaps), 360)
  assert.equal(resolveKunSplitSize(351, snaps), 351)
  assert.equal(resolveKunSplitSize(370, snaps), 370)
  assert.equal(resolveKunSplitSize(405, snaps), 412)
  assert.equal(resolveKunSplitSize(405, { ...snaps, snapThreshold: 4 }), 405)
})

test('the nearest snap point wins; the first one on a tie', () => {
  assert.equal(resolveKunSplitSize(390, { ...range, snapPoints: [380, 396] }), 396)
  assert.equal(resolveKunSplitSize(388, { ...range, snapPoints: [380, 396] }), 380)
})

test('snap points outside [min, max] are ignored', () => {
  assert.equal(resolveKunSplitSize(478, { ...range, snapPoints: [484] }), 478)
})

test('a snap is applied after clamping', () => {
  assert.equal(resolveKunSplitSize(100, { ...range, snapPoints: [244] }), 244)
})

test('a keyboard step is not cancelled or reversed by a snap', () => {
  // 5 px right from a snap point: pulling back to 360 would cancel the step.
  assert.equal(resolveKunSplitSize(365, { ...snaps, from: 360 }), 365)
  // Toward a snap point in the step's direction: snaps.
  assert.equal(resolveKunSplitSize(358, { ...snaps, from: 348 }), 360)
  assert.equal(resolveKunSplitSize(365, { ...snaps, from: 375 }), 360)
  // A step that ends within the threshold snaps.
  assert.equal(resolveKunSplitSize(363, { ...snaps, from: 355 }), 360)
  // A step leftwards that a snap would turn rightwards stays unsnapped.
  assert.equal(resolveKunSplitSize(355, { ...snaps, from: 358 }), 355)
})
