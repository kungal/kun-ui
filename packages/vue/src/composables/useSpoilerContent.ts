import { nextTick, watch, type Ref } from 'vue'

// Click/keyboard-to-reveal spoilers (+ code-block copy buttons) for a v-html
// prose container. DOM-level and framework-neutral — operates on the rendered
// HTML, so it's reusable on any `<div ref class="kun-prose" v-html>`.
//
// SSR-safe BY CONSTRUCTION: the cover-of-record is pure CSS, driven by the
// author's `class="kun-spoiler kun-spoiler-hidden"` (transparent text + a light
// tint). The secret is hidden in the very first server-rendered paint and stays
// hidden with JS disabled or before hydration. On the client we *add* a drifting
// particle canvas on top — a pure enhancement; if it never runs the spoiler is
// still covered.
//
// The particle model is ported from molefrog/spoiled's paint worklet: every
// particle is a pure function of one shared clock `t`, with a spawn → fly → fade
// → respawn lifecycle (that churn is what reads as floating dust). Revealing a
// spoiler sets a `tStop`, which fades the field out sequentially and stops it.
//
// Performance: ONE shared, fps-throttled rAF loop drives every canvas (not one
// loop each); off-screen spoilers are skipped via a shared IntersectionObserver;
// particle counts are capped by area; reduced-motion users get a single static
// frame and no loop.

const FPS = 30
const FRAME_MS = 1000 / FPS
const DENSITY = 0.08 // particles per css px²
const MAX_PARTICLES = 2500
const FADE = 0.6 // seconds — fade-in on appear and dissolve on reveal
const V_MIN = 2 // particle speed, px/s
const V_MAX = 12
const TAU = Math.PI * 2

const easeOutCubic = (t: number): number => {
  const u = t - 1
  return u * u * u + 1
}
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

// Trapezoidal visibility over a particle's lifetime: grows in (`a`s), holds,
// shrinks out (`b`s).
const trapezoid = (life: number, a: number, b: number, t: number): number => {
  const s = Math.max(a, life - b)
  if (t < a) return Math.max(0, t / a)
  if (t > s) return Math.max(0, 1 - (t - s) / (life - s))
  return 1
}

// Sequential fade — in when the field appears, out (after `tStop`) on reveal.
// Particles start animating staggered across the first 2/3 of `duration`.
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

interface Particle {
  x0: number
  y0: number
  vx: number
  vy: number
  life: number
  cycle: number // life + respawn
  phase: number
  size0: number
  light: number // hsl lightness 0–100
  square: boolean
}

interface ParticleField {
  el: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  w: number
  h: number
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
  const { ctx, w, h, particles, tStop } = f
  const t = clock - f.bornAt
  const n = particles.length
  ctx.clearRect(0, 0, w, h)
  for (let i = 0; i < n; i++) {
    const p = particles[i]!
    // can't respawn after the field has been told to stop
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
    // drift + wrap so the cloud never thins at the edges
    let x = (((p.x0 + p.vx * lt) % w) + w) % w
    let y = (((p.y0 + p.vy * lt) % h) + h) % h
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
  const count = Math.min(MAX_PARTICLES, Math.max(6, Math.round(f.w * f.h * DENSITY)))
  const r = Math.random
  f.particles = Array.from({ length: count }, () => {
    const angle = r() * TAU
    const speed = V_MIN + r() * (V_MAX - V_MIN)
    const life = 0.3 + r() * 1.2
    const cycle = life + r() // up to 1s respawn delay
    const ldir = r() < 0.5 ? -1 : 1
    return {
      x0: r() * f.w,
      y0: r() * f.h,
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
    particles: [],
    inView: true,
    animated: !reducedMotion(),
    bornAt: clock,
    tStop: null,
  }
  field.ro = new ResizeObserver(() => {
    if (sizeCanvas(field)) {
      seed(field)
      if (!field.animated) drawField(field)
    }
  })

  fields.add(field)
  elToField.set(el, field)
  field.ro.observe(el)

  if (sizeCanvas(field)) {
    seed(field)
    if (field.animated) {
      getIO().observe(el)
      startLoop()
    } else {
      drawField(field) // reduced motion: a single static frame
    }
  }
}

const destroyField = (el: HTMLElement) => {
  const field = elToField.get(el)
  if (!field) return
  field.ro?.disconnect()
  sharedIO?.unobserve(el)
  field.canvas.remove()
  fields.delete(field)
  elToField.delete(el)
  stopLoopIfIdle()
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
    if (field && field.animated && !reducedMotion()) {
      // dissolve the field out; the loop destroys it once the fade completes.
      field.tStop = clock - field.bornAt
      startLoop()
    } else {
      destroyField(el)
    }
    localFields.delete(el)
  }

  const handleCopyClick = (copyButton: HTMLElement) => {
    const container = copyButton.closest('.kun-code-container')
    const pre = container?.querySelector('pre')
    if (!pre) return
    navigator.clipboard
      .writeText(pre.innerText)
      .then(() => {
        copyButton.classList.add('copied')
        setTimeout(() => copyButton.classList.remove('copied'), 3000)
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
    const copyButton = target.closest<HTMLElement>('.copy')
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
