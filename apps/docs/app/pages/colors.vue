<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Full color reference for KunUI. Swatches are painted with the RAW channel vars
// (`oklch(var(--primary-500))`), which always live in :root (authored in
// @kungal/ui-tokens), so we never depend on a Tailwind utility being emitted —
// and they flip with the theme for free. Hex labels are resolved on the client
// (canvas round-trip) and recomputed when the .kun-dark-mode class toggles.
useKunSeoMeta()

const colors = [
  'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'default',
] as const
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const surfaces = [
  { token: 'background', label: '页面背景' },
  { token: 'content1', label: '卡片 / 浮层' },
  { token: 'content2', label: '次级面' },
  { token: 'content3', label: '三级面' },
  { token: 'content4', label: '四级面' },
] as const

const v = (token: string) => `oklch(var(--${token}))`

// Resolve each [data-token] swatch's painted colour → hex, refreshed on theme switch.
const hex = ref<Record<string, string>>({})
let observer: MutationObserver | null = null
const compute = () => {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return
  const out: Record<string, string> = {}
  for (const el of document.querySelectorAll<HTMLElement>('[data-token]')) {
    ctx.fillStyle = '#000'
    ctx.fillStyle = getComputedStyle(el).backgroundColor
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    out[el.dataset.token!] =
      '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  }
  hex.value = out
}
onMounted(() => {
  compute()
  observer = new MutationObserver(compute)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <!-- Semantic solids + their generated on-colors -->
    <h2 class="mt-10 mb-1 text-xl font-semibold">语义色 · 实心</h2>
    <p class="text-default-600 mb-4 text-sm">
      每个语义色的实心填充(<code>bg-{color}</code>)与配对前景
      <code>text-{color}-foreground</code> —— 前景由对比度生成,实心配色在明暗两模式均 ≥ WCAG AA。
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="c in colors"
        :key="c"
        :data-token="`${c}-accent`"
        class="rounded-kun-lg shadow-kun-sm flex aspect-square flex-col items-center justify-center gap-1"
        :style="{ backgroundColor: v(`${c}-accent`), color: v(`${c}-on`) }"
      >
        <span class="text-xl font-semibold">Aa</span>
        <span class="text-sm font-medium">{{ c }}</span>
        <span class="font-mono text-[11px] opacity-80">{{ hex[`${c}-accent`] || '·' }}</span>
      </div>
    </div>

    <!-- Full shade ramps -->
    <h2 class="mt-10 mb-1 text-xl font-semibold">色阶</h2>
    <p class="text-default-600 mb-4 text-sm">
      每个色相的 11 级色阶(<code>bg-{color}-{50…950}</code>)。基于 OKLCH 感知均匀生成,
      同一档在不同色相上明暗一致;暗色模式下整条色阶翻转。
    </p>
    <div class="space-y-4">
      <div v-for="c in colors" :key="c">
        <div class="mb-1.5 text-sm font-medium capitalize">{{ c }}</div>
        <div class="grid grid-cols-11 gap-1">
          <div v-for="s in shades" :key="s" class="text-center">
            <div
              class="rounded-kun-sm h-10 w-full"
              :style="{ backgroundColor: v(`${c}-${s}`) }"
              :title="`${c}-${s}`"
            />
            <div class="text-default-500 mt-1 font-mono text-[10px]">{{ s }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Text on the page and on cards -->
    <h2 class="mt-10 mb-1 text-xl font-semibold">文字</h2>
    <p class="text-default-600 mb-4 text-sm">
      正文用 <code>text-foreground</code>;说明、辅助文字、时间戳、计数等次要文字用
      <code>text-foreground-muted</code>。它在浅色模式取 <code>default-600</code>、暗色模式取
      <code>default-500</code>,在页面背景与卡片(<code>content1</code>)上两模式均 ≥ WCAG AA,
      由生成器校验。<code>text-default-500</code> 在浅色页面背景上只有 3.33:1,不要用作可读文字。
    </p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        v-for="su in surfaces.slice(0, 2)"
        :key="su.token"
        class="rounded-kun-lg border-kun space-y-1 border p-4"
        :style="{ backgroundColor: v(su.token) }"
      >
        <p class="text-sm font-medium" :style="{ color: v('foreground') }">
          foreground · {{ su.label }}
        </p>
        <p class="text-sm" :style="{ color: v('foreground-muted') }">
          foreground-muted · 发布于 3 分钟前 · 12 条回复
        </p>
      </div>
    </div>

    <h3 class="mt-8 mb-1 text-base font-semibold">彩色文字</h3>
    <p class="text-default-600 mb-4 text-sm">
      彩色文字(light / bordered / flat 变体、选中的 Tab、链接、错误提示)用 <code>text-{color}-text</code>,
      不要直接用填充色 <code>text-{color}</code>:填充色当文字在浅色页面背景上只有 1.75–4.42:1。
      <code>{color}-text</code> 取色阶里离填充色最近、且在页面背景、卡片以及该颜色 20% 着色(悬停、键盘焦点、flat)
      上两模式均 ≥ WCAG AA 的一级,由生成器校验。
    </p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        v-for="su in surfaces.slice(0, 2)"
        :key="su.token"
        class="rounded-kun-lg border-kun flex flex-wrap gap-2 border p-4"
        :style="{ backgroundColor: v(su.token) }"
      >
        <span
          v-for="c in colors.filter((x) => x !== 'default')"
          :key="c"
          class="rounded-kun-md px-2 py-1 text-sm font-medium"
          :style="{ color: v(`${c}-text`), backgroundColor: `oklch(var(--${c}-accent) / 0.2)` }"
        >
          {{ c }}-text
        </span>
      </div>
    </div>

    <!-- Neutral surfaces / elevation -->
    <h2 class="mt-10 mb-1 text-xl font-semibold">表面 · 层级</h2>
    <p class="text-default-600 mb-4 text-sm">
      中性表面构成层级:页面背景 &lt; 卡片(<code>content1</code>)&lt; 更深的 well。
      卡片与输入框靠填充 + 阴影抬升,而非描边。
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <div
        v-for="su in surfaces"
        :key="su.token"
        :data-token="su.token"
        class="rounded-kun-lg border-kun flex aspect-square flex-col items-center justify-center gap-0.5 border p-2 text-center"
        :style="{ backgroundColor: v(su.token) }"
      >
        <span class="text-foreground font-mono text-xs">{{ su.token }}</span>
        <span class="text-default-500 text-[11px]">{{ su.label }}</span>
        <span class="text-default-500 font-mono text-[10px]">{{ hex[su.token] || '·' }}</span>
      </div>
    </div>
  </article>
</template>
