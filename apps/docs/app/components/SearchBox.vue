<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo } from '#imports'
import { pageMeta } from '~/site.config'
import { nav } from '~/nav'
import type { KunCommandItem } from '@kungal/ui-vue'

// The ⌘K UI (dialog, keyboard nav, highlight, a11y) now lives in the library's
// <KunCommandPalette>. This file keeps only the docs-specific search: build an
// index from pageMeta, score it against the query, map hits → command items.
interface Doc {
  route: string
  title: string
  cn: string
  section: string
  body: string
}
interface Hit {
  doc: Doc
  score: number
  snippet?: string
}

const sectionOf = (route: string) =>
  nav.find((s) => s.items.some((i) => i.to === route))?.title ?? ''

const index: Doc[] = Object.entries(pageMeta).map(([route, m]) => ({
  route,
  title: m.title,
  cn: m.cn ?? '',
  section: sectionOf(route),
  body: m.description ?? '',
}))

const open = ref(false)
const query = ref('')

const terms = computed(() =>
  query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
)

function makeSnippet(body: string, ts: string[]): string | undefined {
  const lower = body.toLowerCase()
  let pos = -1
  for (const t of ts) {
    const i = lower.indexOf(t)
    if (i !== -1 && (pos === -1 || i < pos)) pos = i
  }
  if (pos === -1) return body.slice(0, 80) + (body.length > 80 ? '…' : '')
  const start = Math.max(0, pos - 30)
  const end = Math.min(body.length, pos + 70)
  return (
    (start > 0 ? '…' : '') +
    body.slice(start, end).trim() +
    (end < body.length ? '…' : '')
  )
}

const results = computed<Hit[]>(() => {
  const ts = terms.value
  if (!ts.length) return []
  const hits: Hit[] = []
  for (const doc of index) {
    const title = doc.title.toLowerCase()
    const cn = doc.cn.toLowerCase()
    const section = doc.section.toLowerCase()
    const body = doc.body.toLowerCase()
    let score = 0
    for (const t of ts) {
      if (title.includes(t)) score += 12
      if (cn.includes(t)) score += 10
      if (section.includes(t)) score += 3
      let i = body.indexOf(t)
      let n = 0
      while (i !== -1 && n < 5) {
        score += 1
        n++
        i = body.indexOf(t, i + t.length)
      }
    }
    const allPresent = ts.every(
      (t) =>
        title.includes(t) ||
        cn.includes(t) ||
        section.includes(t) ||
        body.includes(t)
    )
    if (score > 0 && allPresent)
      hits.push({ doc, score, snippet: makeSnippet(doc.body, ts) })
  }
  hits.sort((a, b) => b.score - a.score)
  return hits.slice(0, 8)
})

const heading = (d: Doc) => (d.cn ? `${d.title} · ${d.cn}` : d.title)

// Map scored hits → the shell's item shape. `section` is the caption, `label`
// the title, `description` the snippet — the palette highlights them for us.
const items = computed<KunCommandItem[]>(() =>
  results.value.map((hit) => ({
    value: hit.doc.route,
    label: heading(hit.doc),
    description: hit.snippet,
    section: hit.doc.section,
  }))
)

function go(item: KunCommandItem) {
  navigateTo(String(item.value))
}
</script>

<template>
  <KunCommandPalette
    v-model:open="open"
    v-model:query="query"
    :items="items"
    placeholder="搜索组件、页面…"
    empty-text="输入关键字搜索组件与页面"
    aria-label="搜索文档"
    @select="go"
  >
    <template #trigger="{ open, shortcut }">
      <!-- The classic docs trigger: a search field on md+, icon-only on mobile. -->
      <button
        type="button"
        aria-label="搜索文档"
        class="border-kun text-default-400 hover:border-primary hover:text-default-600 flex cursor-pointer items-center gap-2 rounded-kun-md border p-2 text-sm transition-colors md:w-56 md:px-3"
        @click="open"
      >
        <KunIcon name="lucide:search" class="shrink-0" />
        <span class="hidden flex-1 text-left md:inline">搜索文档…</span>
        <kbd
          class="border-kun text-default-400 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium md:inline"
        >
          {{ shortcut }}
        </kbd>
      </button>
    </template>
  </KunCommandPalette>
</template>
