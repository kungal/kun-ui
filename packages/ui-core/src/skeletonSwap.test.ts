import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  initialKunSkeletonSwap,
  nextKunSkeletonSwap,
  type KunSkeletonSwapStep,
} from './skeletonSwap.ts'

const timing = { delay: 150, minDuration: 300 }

const run = (
  step: KunSkeletonSwapStep,
  loading: boolean,
  now: number,
  t = timing
): KunSkeletonSwapStep => nextKunSkeletonSwap(step.state, loading, now, t)

test('not loading at first: content, nothing scheduled', () => {
  const s = initialKunSkeletonSwap(false, 0, timing, false)
  assert.equal(s.state.view, 'content')
  assert.equal(s.wakeAt, null)
  assert.equal(initialKunSkeletonSwap(false, 0, timing, true).state.view, 'content')
})

test('loading at mount: pending until the delay, then the skeleton', () => {
  const s0 = initialKunSkeletonSwap(true, 1000, timing, false)
  assert.equal(s0.state.view, 'pending')
  assert.equal(s0.wakeAt, 1150)
  const s1 = run(s0, true, 1150)
  assert.equal(s1.state.view, 'skeleton')
  assert.equal(s1.state.shownAt, 1150)
  assert.equal(s1.wakeAt, null)
})

test('loading at mount that ends within the delay never shows the skeleton', () => {
  const s0 = initialKunSkeletonSwap(true, 0, timing, false)
  const s1 = run(s0, false, 80)
  assert.equal(s1.state.view, 'content')
  assert.equal(s1.wakeAt, null)
})

test('server render and hydration show the skeleton at once', () => {
  const s = initialKunSkeletonSwap(true, 0, timing, true)
  assert.equal(s.state.view, 'skeleton')
  assert.equal(s.state.shownAt, 0)
  assert.equal(s.wakeAt, null)
})

test('a delay of 0 shows the skeleton at once on the client too', () => {
  const s = initialKunSkeletonSwap(true, 0, { ...timing, delay: 0 }, false)
  assert.equal(s.state.view, 'skeleton')
})

test('refetching keeps the content until the delay passes', () => {
  const content = initialKunSkeletonSwap(false, 0, timing, false)
  const s1 = run(content, true, 500)
  assert.equal(s1.state.view, 'content')
  assert.equal(s1.state.loadingSince, 500)
  assert.equal(s1.wakeAt, 650)
  const fast = run(s1, false, 600)
  assert.equal(fast.state.view, 'content')
  assert.equal(fast.wakeAt, null)
  const slow = run(s1, true, 650)
  assert.equal(slow.state.view, 'skeleton')
})

test('an early wake-up re-schedules for the same moment', () => {
  const s0 = initialKunSkeletonSwap(true, 0, timing, false)
  const s1 = run(s0, true, 149)
  assert.equal(s1.state.view, 'pending')
  assert.equal(s1.wakeAt, 150)
})

test('a shown skeleton stays for minDuration', () => {
  const shown = run(initialKunSkeletonSwap(true, 0, timing, false), true, 150)
  const s1 = run(shown, false, 200)
  assert.equal(s1.state.view, 'skeleton')
  assert.equal(s1.wakeAt, 450)
  assert.equal(run(s1, false, 450).state.view, 'content')
})

test('loading past minDuration swaps as soon as it ends', () => {
  const shown = run(initialKunSkeletonSwap(true, 0, timing, false), true, 150)
  const s1 = run(shown, false, 2000)
  assert.equal(s1.state.view, 'content')
  assert.equal(s1.wakeAt, null)
})

test('loading again while held by minDuration keeps the skeleton', () => {
  const shown = run(initialKunSkeletonSwap(true, 0, timing, false), true, 150)
  const held = run(shown, false, 200)
  const again = run(held, true, 300)
  assert.equal(again.state.view, 'skeleton')
  assert.equal(again.wakeAt, null)
  assert.equal(again.state.shownAt, 150)
})

test('a loading run that stops and restarts within the delay starts the delay over', () => {
  const content = initialKunSkeletonSwap(false, 0, timing, false)
  const a = run(content, true, 0)
  const b = run(a, false, 100)
  const c = run(b, true, 120)
  assert.equal(c.state.view, 'content')
  assert.equal(c.wakeAt, 270)
})

test('negative timings behave as 0', () => {
  const t = { delay: -10, minDuration: -10 }
  const s0 = initialKunSkeletonSwap(true, 0, t, false)
  assert.equal(s0.state.view, 'skeleton')
  assert.equal(run(s0, false, 0, t).state.view, 'content')
})
