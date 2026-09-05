<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { cn } from '@kungal/ui-core'
import type { KunShatterProps } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// KunShatter — breaks its slot content into glass shards that fly apart, and can
// re-form by flying the same shards back in (a reverse "reassemble").
//
// THE PERFORMANCE CONTRACT (this is the whole reason the component exists):
//   • The flying animation is *compositor-only* — every shard animates ONLY
//     `transform` + `opacity`, the two properties that run on the GPU/compositor
//     thread without re-running layout or paint. So once the shards exist, the
//     ~1s animation holds 60fps no matter how many pieces there are.
//   • `clip-path` carves each shard's glass edge but is set ONCE and never
//     animated (animating clip-path is NOT compositor-accelerated yet).
//   • The one-time build cost is bounded to ≈ the element's own area: each shard
//     is a box the size of its *bounding box* (not the whole element) with
//     `overflow:hidden` + `contain:paint`, so the browser only paints that shard's
//     slice and only allocates a layer texture that small. N shards therefore tile
//     to ~1× the element instead of N× full-size layers (the classic shatter trap).
//   • The motion is a *sampled* ballistic trajectory (outward impulse + air drag +
//     gravity as t² acceleration) baked into many short linear keyframes — so it
//     reads as continuous and physical, not a single snap-then-freeze ease.
//   • Zero runtime deps: the Voronoi shard geometry is computed here by clipping a
//     rectangle against the perpendicular bisectors between seed points. Shards are
//     generated *deterministically* from a seed, so `restore()` can rebuild the
//     exact same pieces and fly them back home.
//
// Server-render-safe: the wrapper just renders the slot; all DOM/measurement work
// happens on the client when a break is triggered.
// ─────────────────────────────────────────────────────────────────────────────
defineOptions({ name: 'KunShatter' })

const props = withDefaults(defineProps<KunShatterProps>(), {
  trigger: 'manual',
  pieces: 24,
  duration: 1100,
  origin: 'center',
  spread: 1,
  gravity: 1,
  rotation: 140,
  fade: true,
  easing: 'linear',
  reassemble: true,
  autoRestore: 0,
  keepSpace: false,
  disabled: false,
  disableAnimation: false,
  zIndex: 9999,
  className: '',
})

// `v-model:shattered` — declarative control. Flipping it to true breaks the
// content; back to false re-forms it. The component also flips it to true itself
// when an imperative / click break finishes, so external state stays in sync.
const shattered = defineModel<boolean>('shattered', { default: false })
const emit = defineEmits<{
  /** The shatter animation has begun. */
  shatterStart: []
  /** The last shard has landed. */
  shatterEnd: []
  /** The reassemble animation has finished. */
  restoreEnd: []
}>()

const rootRef = ref<HTMLElement | null>(null)
// SSR-safe + reactive; honoured so a reduced-motion user gets an instant hide.
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

type Phase = 'idle' | 'shattering' | 'shattered' | 'restoring'
const phase = ref<Phase>('idle')

let overlayEl: HTMLDivElement | null = null
let runningAnims: Animation[] = []
let restoreTimer: ReturnType<typeof setTimeout> | null = null
const lastPointer = { x: 0, y: 0, set: false }
// Enough to rebuild the exact same shards for the reverse "reassemble".
let lastBreak: { seed: number; ox: number; oy: number } | null = null

// The host is hidden / revealed entirely imperatively (no reactive :style), so a
// re-render can never fight the in-flight inline styles we set on it.
const hideHost = (host: HTMLElement) => {
  host.style.visibility = ''
  if (props.keepSpace) host.style.visibility = 'hidden'
  else host.style.display = 'none'
}
const showHost = (host: HTMLElement) => {
  host.style.visibility = ''
  host.style.display = ''
}

// ── geometry helpers (dependency-free) ──────────────────────────────────────
type Pt = [number, number]
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

// Tiny deterministic PRNG (mulberry32) so a fixed `seed` reproduces a break
// exactly — also lets `restore()` regenerate the identical pieces.
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Seed points for the Voronoi diagram. ~⅔ are scattered radially around the
// impact point with density concentrated near it (small shards at impact, large
// ones at the edges — the signature glass look); the rest are uniform so corners
// never become one giant cell.
function makeSeeds(w: number, h: number, n: number, rng: () => number, ox: number, oy: number): Pt[] {
  const seeds: Pt[] = []
  const R = Math.hypot(w, h)
  const nr = Math.round(n * 0.68)
  for (let k = 0; k < nr; k++) {
    const a = rng() * Math.PI * 2
    const rad = R * 0.55 * Math.pow(rng(), 1.7)
    seeds.push([clamp(ox + Math.cos(a) * rad, 0, w), clamp(oy + Math.sin(a) * rad, 0, h)])
  }
  for (let k = nr; k < n; k++) seeds.push([rng() * w, rng() * h])
  // Jitter to break exact duplicates (which would make degenerate zero-area cells).
  return seeds.map(([x, y]) => [x + (rng() - 0.5) * 0.5, y + (rng() - 0.5) * 0.5] as Pt)
}

// Clip a convex polygon to the half-plane of points closer to `s` than to `t`
// (Sutherland–Hodgman against the perpendicular bisector of s,t).
function clipHalfPlane(poly: Pt[], s: Pt, t: Pt): Pt[] {
  const mx = (s[0] + t[0]) / 2
  const my = (s[1] + t[1]) / 2
  const nx = t[0] - s[0]
  const ny = t[1] - s[1]
  const side = (p: Pt) => (p[0] - mx) * nx + (p[1] - my) * ny // <0 ⇒ closer to s (keep)
  const out: Pt[] = []
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i]
    const B = poly[(i + 1) % poly.length]
    if (!A || !B) continue
    const sa = side(A)
    const sb = side(B)
    if (sa <= 0) out.push(A)
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
      const u = sa / (sa - sb)
      out.push([A[0] + u * (B[0] - A[0]), A[1] + u * (B[1] - A[1])])
    }
  }
  return out
}

// A seed's Voronoi cell = the element rect clipped by the bisector against every
// other seed. O(n²) but n is small and this runs once per break.
function voronoiCells(seeds: Pt[], w: number, h: number): Pt[][] {
  const cells: Pt[][] = []
  for (let i = 0; i < seeds.length; i++) {
    const si = seeds[i]
    if (!si) continue
    let cell: Pt[] = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ]
    for (let j = 0; j < seeds.length && cell.length >= 3; j++) {
      const sj = seeds[j]
      if (i !== j && sj) cell = clipHalfPlane(cell, si, sj)
    }
    if (cell.length >= 3) cells.push(cell)
  }
  return cells
}

function resolveOrigin(w: number, h: number): Pt {
  const o = props.origin
  if (o === 'top') return [w / 2, 0]
  if (o === 'pointer') return lastPointer.set ? [clamp(lastPointer.x, 0, w), clamp(lastPointer.y, 0, h)] : [w / 2, h / 2]
  if (o && typeof o === 'object') return [clamp(o.x, 0, w), clamp(o.y, 0, h)]
  return [w / 2, h / 2] // 'center' + fallback
}

// ── shard model ─────────────────────────────────────────────────────────────
type ShardDesc = {
  minX: number
  minY: number
  bw: number
  bh: number
  clip: string
  originX: number
  originY: number
  delay: number
  kf: Keyframe[]
}

// Deterministically generate every shard (geometry + keyframes) from a seed. The
// rng is consumed in the same order regardless of `mode`, so 'out' (break) and
// 'in' (reassemble) produce identical pieces — `restore()` reuses the break seed
// so each shard flies back from exactly where it landed.
function generateShards(w: number, h: number, seedVal: number, ox: number, oy: number, mode: 'out' | 'in'): ShardDesc[] {
  const rng = mulberry32(seedVal || 1)
  const n = clamp(Math.round(props.pieces), 2, 160)
  const cells = voronoiCells(makeSeeds(w, h, n, rng, ox, oy), w, h)
  const reach = props.spread * Math.hypot(w, h) * 0.5
  const maxD = Math.max(1, Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)))
  const STEPS = 16
  const descs: ShardDesc[] = []

  for (const cell of cells) {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let cx = 0
    let cy = 0
    for (const [x, y] of cell) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
      cx += x
      cy += y
    }
    cx /= cell.length
    cy /= cell.length
    const bw = maxX - minX
    const bh = maxY - minY
    if (bw < 0.5 || bh < 0.5) continue
    const clip = cell.map(([x, y]) => `${(x - minX).toFixed(2)}px ${(y - minY).toFixed(2)}px`).join(',')

    // Per-shard motion parameters — consumed from rng in a fixed order so the two
    // modes stay in lockstep.
    let dx = cx - ox
    let dy = cy - oy
    let dl = Math.hypot(dx, dy)
    if (dl < 0.01) {
      const a = rng() * Math.PI * 2
      dx = Math.cos(a)
      dy = Math.sin(a)
      dl = 1
    }
    dx /= dl
    dy /= dl
    const launch = reach * (0.32 + rng() * 0.55) // gentle outward push, not a hard snap
    const vx = dx * launch
    const vy = dy * launch * 0.8
    const grav = props.gravity * reach * (0.85 + rng() * 0.5) // downward accel (applied ×t²)
    const spin = (rng() * 2 - 1) * props.rotation
    const sEnd = 0.8 + rng() * 0.16
    const fadeFrom = 0.5 + rng() * 0.18
    // Shards nearest the impact let go first — the fracture propagates outward.
    const delay = (dl / maxD) * Math.min(props.duration * 0.22, 120)
    // Scattered rest position (where 'out' ends and 'in' begins) — identical math.
    const ex = vx // drag(1) == 1
    const ey = vy + grav

    const kf: Keyframe[] = []
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS
      let x: number
      let y: number
      let rot: number
      let sc: number
      let op: number
      if (mode === 'out') {
        // home → scattered: launch out, decelerate (drag), accelerate down (gravity), fade out late.
        const drag = 1 - Math.pow(1 - t, 1.7)
        x = vx * drag
        y = vy * drag + grav * t * t
        rot = spin * t
        sc = 1 - (1 - sEnd) * t
        op = !props.fade ? 1 : t < fadeFrom ? 1 : Math.max(0, 1 - (t - fadeFrom) / (1 - fadeFrom))
      } else {
        // scattered → home: converge and *decelerate into place* (easeOut), unwind
        // the spin, scale back up, fade in early. Starts exactly where 'out' ended.
        const e = 1 - Math.pow(1 - t, 2) // easeOut: slow into home
        const f = 1 - e
        x = ex * f
        y = ey * f
        rot = spin * f
        sc = sEnd + (1 - sEnd) * e
        op = !props.fade ? 1 : Math.min(1, t / 0.4)
      }
      kf.push({
        offset: +t.toFixed(4),
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`,
        opacity: +op.toFixed(3),
        easing: 'linear',
      })
    }
    descs.push({ minX, minY, bw, bh, clip, originX: cx - minX, originY: cy - minY, delay, kf })
  }
  return descs
}

// Build the body-level overlay + one bbox-sized, clipped shard per descriptor
// (each holding a clone of the current content). Returns the el↔desc pairs.
function buildOverlay(rect: DOMRect, descs: ShardDesc[]): { el: HTMLDivElement; desc: ShardDesc }[] {
  const host = rootRef.value
  if (!host) return []
  const w = rect.width
  const h = rect.height

  // One painted clone of the live box; each shard re-clones it (cheap) and clips
  // to its own cell. Reset any inline hide we put on the host so the clone shows.
  const master = host.cloneNode(true) as HTMLElement
  master.removeAttribute('id')
  Object.assign(master.style, {
    margin: '0',
    inset: 'auto',
    position: 'static',
    transform: 'none',
    display: '',
    visibility: 'visible',
  })

  // Positioned in DOCUMENT (page) coordinates on <body>, NOT viewport-fixed, so the
  // shards scroll *with* the page and stay locked to the host. A fixed overlay would
  // decouple the moment the user scrolls mid-animation — the shards would converge to
  // a stale viewport spot and the re-formed element would appear to "teleport".
  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'absolute',
    left: `${rect.left + window.scrollX}px`,
    top: `${rect.top + window.scrollY}px`,
    width: `${w}px`,
    height: `${h}px`,
    pointerEvents: 'none',
    overflow: 'visible',
    contain: 'layout',
    zIndex: String(props.zIndex),
  })
  overlay.setAttribute('aria-hidden', 'true')

  const frag = document.createDocumentFragment()
  const pairs: { el: HTMLDivElement; desc: ShardDesc }[] = []
  for (const desc of descs) {
    const shard = document.createElement('div')
    Object.assign(shard.style, {
      position: 'absolute',
      left: `${desc.minX}px`,
      top: `${desc.minY}px`,
      width: `${desc.bw}px`,
      height: `${desc.bh}px`,
      overflow: 'hidden',
      clipPath: `polygon(${desc.clip})`,
      transformOrigin: `${desc.originX.toFixed(2)}px ${desc.originY.toFixed(2)}px`,
      willChange: 'transform, opacity',
      contain: 'layout paint',
      backfaceVisibility: 'hidden',
    })
    // The clone is full element-size, shifted so this shard's slice shows through
    // the bbox window. `overflow:hidden` on the shard bounds the paint + layer.
    const piece = master.cloneNode(true) as HTMLElement
    Object.assign(piece.style, {
      position: 'absolute',
      left: `${-desc.minX}px`,
      top: `${-desc.minY}px`,
      width: `${w}px`,
      height: `${h}px`,
      margin: '0',
    })
    shard.appendChild(piece)
    frag.appendChild(shard)
    pairs.push({ el: shard, desc })
  }
  overlay.appendChild(frag)
  document.body.appendChild(overlay)
  overlayEl = overlay
  return pairs
}

function play(pairs: { el: HTMLDivElement; desc: ShardDesc }[], onDone: () => void) {
  runningAnims = pairs.map(({ el, desc }) =>
    el.animate(desc.kf, { duration: props.duration, delay: desc.delay, easing: props.easing, fill: 'both' })
  )
  if (!runningAnims.length) {
    onDone()
    return
  }
  Promise.allSettled(runningAnims.map((a) => a.finished)).then(onDone)
}

// ── the break ───────────────────────────────────────────────────────────────
function runShatter(originPt?: Pt) {
  const host = rootRef.value
  if (!host || phase.value !== 'idle' || props.disabled) return

  const rect = host.getBoundingClientRect()
  const w = rect.width
  const h = rect.height

  emit('shatterStart')
  phase.value = 'shattering'

  // No-motion path: reduced-motion, explicit opt-out, no WAAPI, or nothing to
  // measure → skip the shards and just hide.
  if (reduced.value || props.disableAnimation || w < 2 || h < 2 || typeof host.animate !== 'function') {
    lastBreak = null
    finishShatter()
    return
  }

  const [ox, oy] = originPt ?? resolveOrigin(w, h)
  const seedVal =
    (props.seed ?? Math.floor((typeof performance !== 'undefined' ? performance.now() : 0) * 1000)) >>> 0
  lastBreak = { seed: seedVal || 1, ox, oy }
  const pairs = buildOverlay(rect, generateShards(w, h, lastBreak.seed, ox, oy, 'out'))
  // Overlay (identical pixels) is already on top, so hiding the original now is
  // seamless — no flash. Imperative for frame accuracy.
  host.style.visibility = 'hidden'

  requestAnimationFrame(() => {
    if (phase.value !== 'shattering') return // restored before paint
    play(pairs, () => {
      if (phase.value === 'shattering') finishShatter()
    })
  })
}

function finishShatter() {
  cleanupOverlay()
  const host = rootRef.value
  if (host) hideHost(host)
  phase.value = 'shattered'
  shattered.value = true
  emit('shatterEnd')
  if (props.autoRestore > 0) restoreTimer = setTimeout(doRestore, props.autoRestore)
}

// ── the re-form ───────────────────────────────────────────────────────────────
function doRestore() {
  if (restoreTimer) {
    clearTimeout(restoreTimer)
    restoreTimer = null
  }
  if (phase.value === 'idle') {
    shattered.value = false
    return
  }
  if (phase.value === 'restoring') return // already re-forming

  // Stop any in-flight break first.
  cleanupOverlay()
  const host = rootRef.value
  const canAnimate =
    props.reassemble &&
    !reduced.value &&
    !props.disableAnimation &&
    !!lastBreak &&
    !!host &&
    typeof host?.animate === 'function'

  if (!host || !canAnimate || !lastBreak) {
    if (host) showHost(host)
    phase.value = 'idle'
    shattered.value = false
    return
  }

  // Make the host occupy its layout slot but stay invisible, so we can measure
  // where the shards must converge, then reveal it seamlessly at the end.
  host.style.display = ''
  host.style.visibility = 'hidden'
  const rect = host.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  if (w < 2 || h < 2) {
    showHost(host)
    phase.value = 'idle'
    shattered.value = false
    return
  }

  phase.value = 'restoring'
  const pairs = buildOverlay(rect, generateShards(w, h, lastBreak.seed, lastBreak.ox, lastBreak.oy, 'in'))
  requestAnimationFrame(() => {
    if (phase.value !== 'restoring') return
    play(pairs, () => {
      if (phase.value === 'restoring') finishRestore()
    })
  })
}

function finishRestore() {
  cleanupOverlay()
  const host = rootRef.value
  if (host) showHost(host)
  phase.value = 'idle'
  shattered.value = false
  emit('restoreEnd')
}

function cleanupOverlay() {
  for (const a of runningAnims) {
    try {
      a.cancel()
    } catch {
      /* already finished */
    }
  }
  runningAnims = []
  if (overlayEl) {
    overlayEl.remove()
    overlayEl = null
  }
}

// ── triggers ────────────────────────────────────────────────────────────────
function onTriggerClick(e: MouseEvent) {
  if (props.trigger !== 'click' || phase.value !== 'idle' || props.disabled) return
  const host = rootRef.value
  if (!host) return
  const r = host.getBoundingClientRect()
  runShatter([e.clientX - r.left, e.clientY - r.top]) // impact at the click point
}

function onPointerMove(e: PointerEvent) {
  // Only origin="pointer" needs this; otherwise skip the per-move
  // getBoundingClientRect (a forced layout) entirely.
  if (props.origin !== 'pointer') return
  const host = rootRef.value
  if (!host) return
  const r = host.getBoundingClientRect()
  lastPointer.x = e.clientX - r.left
  lastPointer.y = e.clientY - r.top
  lastPointer.set = true
}

watch(shattered, (v) => {
  if (v && phase.value === 'idle') runShatter()
  else if (!v && phase.value !== 'idle') doRestore()
})

onMounted(() => {
  if (shattered.value) runShatter()
})

onBeforeUnmount(() => {
  if (restoreTimer) clearTimeout(restoreTimer)
  cleanupOverlay()
})

// Imperative API for refs: `shatterRef.value.shatter()` / `.restore()`.
defineExpose({ shatter: (origin?: Pt) => runShatter(origin), restore: doRestore })
</script>

<template>
  <div
    ref="rootRef"
    :class="cn('kun-shatter inline-block', className)"
    @click="onTriggerClick"
    @pointermove.passive="onPointerMove"
  >
    <slot />
  </div>
</template>
