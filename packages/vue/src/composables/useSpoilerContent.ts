import { nextTick, watch, type Ref } from 'vue'

// Click/keyboard-to-reveal spoilers (+ code-block copy buttons) for a v-html
// prose container. DOM-level and framework-neutral — operates on the rendered
// HTML, so it's reusable on any `<div ref class="kun-prose" v-html>`.
//
// SSR-safe BY CONSTRUCTION: the cover-of-record is pure CSS, driven by the
// author's `class="kun-spoiler kun-spoiler-hidden"` (transparent text + a faint
// tint). The secret is hidden in the first server-rendered paint and stays
// hidden with JS disabled. On the client we *add* an animated particle canvas —
// a pure enhancement.
//
// The mask follows the real text shape: we measure each space-separated word run
// with the Range API (`getClientRects()`), giving one rect per word — or, for
// scriptio-continua text like CJK, one rect per wrapped line. Particles and the
// grey tint are confined to those rects, so multi-line spoilers are masked
// line-by-line and word-by-word with the gaps (spaces, ragged line ends) left
// clear — rather than one solid block.
//
// The particle model is ported from molefrog/spoiled's paint worklet: every
// particle is a pure function of one shared clock `t`, with a spawn → fly → fade
// → respawn lifecycle. Revealing sets a `tStop`, which dissolves the field out.
//
// Performance: ONE shared, fps-throttled rAF loop drives every canvas; off-screen
// spoilers are paused via a shared IntersectionObserver; particle counts are
// capped; word rects are measured once per layout (on setup / resize), never per
// frame; reduced-motion users get a single static frame and no loop.

const FPS = 30
const FRAME_MS = 1000 / FPS
const DENSITY = 0.08 // particles per css px² of masked area
const MAX_PARTICLES = 2500
const FADE = 0.6 // seconds — fade-in on appear, dissolve on reveal
const TINT_ALPHA = 0.34
const V_MIN = 2 // particle speed, px/s
const V_MAX = 12
const TAU = Math.PI * 2

const easeOutCubic = (t: number): number => {
  const u = t - 1
  return u * u * u + 1
}
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

const trapezoid = (life: number, a: number, b: number, t: number): number => {
  const s = Math.max(a, life - b)
  if (t < a) return Math.max(0, t / a)
  if (t > s) return Math.max(0, 1 - (t - s) / (life - s))
  return 1
}

const fadeFactor = (
  worldT: number,
  tStop: number | null,
  idx: number,
  n: number,
  duration: number
): number => {
  if (duration <= 0) return 1
  const out = tStop != null && tStop <= worldT
  const startT = out ? tStop : 0
  const t = startT + ((2 / 3) * duration * idx) / n
  const fadeFor = (1 / 3) * duration
  const progress = out ? (worldT - t) / fadeFor : (fadeFor + t - worldT) / fadeFor
  return easeOutCubic(1 - clamp01(progress))
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface Particle {
  rect: Rect
  x0: number // local to rect
  y0: number
  vx: number
  vy: number
  life: number
  cycle: number // life + respawn
  phase: number
  size0: number
  light: number
  square: boolean
}

interface ParticleField {
  el: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  w: number
  h: number
  rects: Rect[]
  particles: Particle[]
  inView: boolean
  animated: boolean
  bornAt: number
  tStop: number | null
  ro?: ResizeObserver
}

const reducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Measure the rectangle of every space-separated word run (one rect per line a
// run occupies). For CJK / no-space text a run spans the whole node, so this
// degrades to one rect per wrapped line. Element-local coordinates. O(words),
// run once per layout — never per frame.
const measureRects = (el: HTMLElement): Rect[] => {
  const base = el.getBoundingClientRect()
  const rects: Rect[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node.nodeValue ?? ''
    for (const m of text.matchAll(/\S+/g)) {
      const start = m.index ?? 0
      range.setStart(node, start)
      range.setEnd(node, start + m[0].length)
      const list = range.getClientRects()
      for (let i = 0; i < list.length; i++) {
        const r = list[i]!
        if (r.width < 0.5 || r.height < 0.5) continue
        rects.push({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height })
      }
    }
  }
  return rects
}

// ── shared animation infrastructure ────────────────────────────────────────
const fields = new Set<ParticleField>()
const elToField = new WeakMap<HTMLElement, ParticleField>()
let rafId = 0
let lastFrame = 0
let clock = 0 // shared world clock, seconds
let sharedIO: IntersectionObserver | null = null

const getIO = (): IntersectionObserver => {
  if (sharedIO) return sharedIO
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const field = elToField.get(entry.target as HTMLElement)
        if (field) field.inView = entry.isIntersecting
      }
    },
    { rootMargin: '120px' }
  )
  return sharedIO
}

const drawField = (f: ParticleField) => {
  const { ctx, w, h, particles, rects, tStop } = f
  const t = clock - f.bornAt
  const n = particles.length
  ctx.clearRect(0, 0, w, h)

  // grey tint behind the particles, confined to the word/line rects; fades in on
  // appear and out on reveal.
  const tintFade =
    tStop != null ? clamp01(1 - (t - tStop) / FADE) : clamp01(t / (FADE * 0.5))
  if (tintFade > 0) {
    ctx.fillStyle = `rgba(150, 150, 150, ${TINT_ALPHA * tintFade})`
    for (let r = 0; r < rects.length; r++) {
      const rect = rects[r]!
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    }
  }

  for (let i = 0; i < n; i++) {
    const p = particles[i]!
    if (
      tStop != null &&
      Math.floor((tStop + p.phase) / p.cycle) < Math.floor((t + p.phase) / p.cycle)
    ) {
      continue
    }
    const fade = fadeFactor(t, tStop, i, n, FADE)
    if (fade <= 0) continue
    const lt = Math.min(p.life, (t + p.phase) % p.cycle)
    const alpha = fade * (1 - lt / p.life)
    if (alpha <= 0.01) continue
    const size = fade * p.size0 * trapezoid(p.life, 0.15, 0.3, lt)
    if (size <= 0) continue
    const rect = p.rect
    const x = rect.x + (((p.x0 + p.vx * lt) % rect.w) + rect.w) % rect.w
    const y = rect.y + (((p.y0 + p.vy * lt) % rect.h) + rect.h) % rect.h
    ctx.globalAlpha = alpha > 1 ? 1 : alpha
    ctx.fillStyle = `hsl(0 0% ${p.light}%)`
    if (p.square) {
      ctx.fillRect(x, y, size, size)
    } else {
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, TAU)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

const loop = (now: number) => {
  rafId = requestAnimationFrame(loop)
  if (lastFrame && now - lastFrame < FRAME_MS) return
  clock += lastFrame ? (now - lastFrame) / 1000 : 0
  lastFrame = now

  const done: ParticleField[] = []
  for (const f of fields) {
    if (!f.animated) continue
    if (f.inView) drawField(f)
    if (f.tStop != null && clock - f.bornAt > f.tStop + FADE) done.push(f)
  }
  for (const f of done) destroyField(f.el)
}

const startLoop = () => {
  if (rafId) return
  lastFrame = 0
  rafId = requestAnimationFrame(loop)
}

const stopLoopIfIdle = () => {
  if (rafId && ![...fields].some((f) => f.animated && f.tStop == null)) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

const seed = (f: ParticleField) => {
  const rects = f.rects
  if (!rects.length) {
    f.particles = []
    return
  }
  // cumulative areas → pick a rect weighted by its area
  let total = 0
  const cum: number[] = []
  for (const r of rects) {
    total += r.w * r.h
    cum.push(total)
  }
  const count = Math.min(MAX_PARTICLES, Math.max(6, Math.round(total * DENSITY)))
  const r = Math.random
  f.particles = Array.from({ length: count }, () => {
    const pick = r() * total
    let lo = 0
    let hi = cum.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cum[mid]! < pick) lo = mid + 1
      else hi = mid
    }
    const rect = rects[lo]!
    const angle = r() * TAU
    const speed = V_MIN + r() * (V_MAX - V_MIN)
    const life = 0.3 + r() * 1.2
    const cycle = life + r()
    const ldir = r() < 0.5 ? -1 : 1
    return {
      rect,
      x0: r() * rect.w,
      y0: r() * rect.h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      cycle,
      phase: r() * cycle,
      size0: 1 + r() * 0.6,
      light: Math.max(8, Math.min(92, 50 + ldir * (16 + r() * 30))),
      square: r() < 0.5,
    }
  })
}

const sizeCanvas = (f: ParticleField): boolean => {
  const w = f.el.clientWidth
  const h = f.el.clientHeight
  if (w < 1 || h < 1) return false
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  f.w = w
  f.h = h
  f.canvas.width = Math.round(w * dpr)
  f.canvas.height = Math.round(h * dpr)
  f.canvas.style.width = `${w}px`
  f.canvas.style.height = `${h}px`
  f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return true
}

const refresh = (f: ParticleField) => {
  if (!sizeCanvas(f)) return
  f.rects = measureRects(f.el)
  // per-word canvas takes over only when there's measurable text; otherwise the
  // CSS block tint remains the cover (e.g. an image-only spoiler).
  f.el.classList.toggle('kun-spoiler-live', f.rects.length > 0)
  seed(f)
  if (!f.animated) drawField(f)
}

const createField = (el: HTMLElement) => {
  if (elToField.has(el)) return
  const canvas = document.createElement('canvas')
  canvas.className = 'kun-spoiler-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '2',
  })
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  el.appendChild(canvas)

  const field: ParticleField = {
    el,
    canvas,
    ctx,
    w: 0,
    h: 0,
    rects: [],
    particles: [],
    inView: true,
    animated: !reducedMotion(),
    bornAt: clock,
    tStop: null,
  }
  field.ro = new ResizeObserver(() => refresh(field))

  fields.add(field)
  elToField.set(el, field)
  field.ro.observe(el)
  refresh(field)

  if (field.animated && field.rects.length) {
    getIO().observe(el)
    startLoop()
  }
}

const destroyField = (el: HTMLElement) => {
  const field = elToField.get(el)
  if (!field) return
  field.ro?.disconnect()
  sharedIO?.unobserve(el)
  field.canvas.remove()
  el.classList.remove('kun-spoiler-live')
  fields.delete(field)
  elToField.delete(el)
  stopLoopIfIdle()
}

// ── code-block copy button ─────────────────────────────────────────────────
// KunContent gives every code block a copy button so downstream doesn't have to
// reimplement it. Self-styled inline (token-aware → adapts to light/dark), so it
// works with or without the opt-in prose.css. Idempotent: a block that already
// carries a `.copy` button (e.g. one emitted by a markdown pipeline) is left
// alone, so we never double up.
const COPY_ICON =
  "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><rect x='9' y='9' width='13' height='13' rx='2'/><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/></svg>"
const CHECK_ICON =
  "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M20 6 9 17l-5-5'/></svg>"

// Parse a trusted, hard-coded SVG string into a DOM node (no innerHTML).
const makeIcon = (svg: string): Node =>
  document.importNode(
    new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement,
    true
  )

const injectCopyButtons = (container: HTMLElement) => {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.dataset.kunCopyReady) return
    // leave pipeline-emitted copy buttons (forum/moyu/wiki) untouched
    if (pre.closest('.kun-code-container')?.querySelector('.copy, .kun-prose-copy')) {
      return
    }
    pre.dataset.kunCopyReady = '1'
    if (getComputedStyle(pre).position === 'static') pre.style.position = 'relative'
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'kun-prose-copy'
    btn.setAttribute('aria-label', '复制代码')
    btn.appendChild(makeIcon(COPY_ICON))
    Object.assign(btn.style, {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.85rem',
      height: '1.85rem',
      padding: '0',
      cursor: 'pointer',
      color: 'oklch(var(--foreground))',
      background: 'oklch(var(--content1))',
      border: '1px solid var(--color-kun-border, oklch(var(--foreground) / 0.14))',
      borderRadius: '0.5rem',
      opacity: '0.75',
      transition: 'opacity 0.15s, color 0.15s',
    })
    pre.appendChild(btn)
  })
}

export const useSpoilerContent = (containerRef: Ref<HTMLElement | null>) => {
  const localFields = new Set<HTMLElement>()

  const tagSpoiler = (el: HTMLElement) => {
    if (!el.dataset.kunSpoilerReady) {
      el.dataset.kunSpoilerReady = '1'
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')
      el.setAttribute('aria-expanded', 'false')
      if (!el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', '剧透内容,点击或按回车显示')
      }
    }
    createField(el)
    localFields.add(el)
  }

  const reveal = (el: HTMLElement) => {
    if (!el.classList.contains('kun-spoiler-hidden')) return
    el.classList.remove('kun-spoiler-hidden')
    el.setAttribute('aria-expanded', 'true')
    el.removeAttribute('role')
    el.removeAttribute('tabindex')
    el.removeAttribute('aria-label')

    const field = elToField.get(el)
    if (field && field.animated && field.rects.length && !reducedMotion()) {
      field.tStop = clock - field.bornAt
      startLoop()
    } else {
      destroyField(el)
    }
    localFields.delete(el)
  }

  const handleCopyClick = (copyButton: HTMLElement) => {
    const pre =
      copyButton.closest('.kun-code-container')?.querySelector('pre') ??
      copyButton.closest('pre')
    if (!pre) return
    const text = (pre.querySelector('code') ?? pre).textContent ?? ''
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copyButton.classList.add('copied')
        if (copyButton.classList.contains('kun-prose-copy')) {
          // self-styled injected button: swap icon for instant feedback
          copyButton.replaceChildren(makeIcon(CHECK_ICON))
          copyButton.style.color = 'oklch(var(--success-500))'
          setTimeout(() => {
            copyButton.replaceChildren(makeIcon(COPY_ICON))
            copyButton.style.color = 'oklch(var(--foreground))'
            copyButton.classList.remove('copied')
          }, 2000)
        } else {
          setTimeout(() => copyButton.classList.remove('copied'), 3000)
        }
      })
      .catch((err) => {
        console.error('复制失败:', err)
      })
  }

  const handleContainerClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    if (!target) return
    const spoiler = target.closest<HTMLElement>('.kun-spoiler.kun-spoiler-hidden')
    if (spoiler) {
      event.preventDefault()
      event.stopPropagation()
      reveal(spoiler)
      return
    }
    const copyButton = target.closest<HTMLElement>('.copy, .kun-prose-copy')
    if (copyButton) {
      event.preventDefault()
      event.stopPropagation()
      handleCopyClick(copyButton)
    }
  }

  const handleContainerKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const target = event.target as HTMLElement | null
    const spoiler = target?.closest<HTMLElement>('.kun-spoiler.kun-spoiler-hidden')
    if (spoiler) {
      event.preventDefault()
      reveal(spoiler)
    }
  }

  const setup = () => {
    const container = containerRef.value
    if (!container) return
    container
      .querySelectorAll<HTMLElement>('.kun-spoiler.kun-spoiler-hidden')
      .forEach(tagSpoiler)
    injectCopyButtons(container)
    container.addEventListener('click', handleContainerClick)
    container.addEventListener('keydown', handleContainerKeydown)
  }

  const cleanup = () => {
    const container = containerRef.value
    localFields.forEach((el) => destroyField(el))
    localFields.clear()
    if (!container) return
    container.removeEventListener('click', handleContainerClick)
    container.removeEventListener('keydown', handleContainerKeydown)
  }

  watch(
    containerRef,
    (newEl, oldEl) => {
      if (oldEl) cleanup()
      if (newEl) nextTick(setup)
    },
    { flush: 'post' }
  )
}
