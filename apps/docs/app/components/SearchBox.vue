<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { navigateTo } from '#imports'
import { pageMeta } from '~/site.config'
import { nav } from '~/nav'

// Native client-side search (⌘K command palette) — no Algolia, no build step,
// works identically in dev and prod. The index is built straight from the
// site's pageMeta (title / Chinese name / description) + nav (section); it's a
// few dozen tiny entries, so it ships inline rather than as a lazy chunk.
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
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

// ⌘K on macOS, Ctrl K elsewhere — label matches the platform.
const isMac = ref(false)
onMounted(() => {
  isMac.value = /mac/i.test(navigator.platform || navigator.userAgent)
})

function openSearch() {
  open.value = true
  nextTick(() => inputEl.value?.focus())
}
function closeSearch() {
  open.value = false
  query.value = ''
  active.value = 0
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string
  )

// Safe highlight: split on the terms (capturing group → odd indices are
// matches), escape every piece, wrap matches in <mark>. Escaping AFTER the
// split avoids matching inside HTML entities.
function highlight(text: string, terms: string[]): string {
  const valid = terms.filter(Boolean).map(escapeRegExp)
  if (!valid.length) return escapeHtml(text)
  const re = new RegExp(`(${valid.join('|')})`, 'gi')
  return text
    .split(re)
    .map((part, i) =>
      i % 2
        ? `<mark class="bg-primary/20 text-foreground rounded-sm px-0.5">${escapeHtml(part)}</mark>`
        : escapeHtml(part)
    )
    .join('')
}

function makeSnippet(body: string, terms: string[]): string | undefined {
  const lower = body.toLowerCase()
  let pos = -1
  for (const t of terms) {
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

const terms = computed(() =>
  query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
)

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
    // every term must appear somewhere (AND semantics)
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

watch(results, () => {
  active.value = 0
})

const heading = (d: Doc) => (d.cn ? `${d.title} · ${d.cn}` : d.title)

function go(hit: Hit) {
  closeSearch()
  navigateTo(hit.doc.route)
}

function move(delta: number) {
  if (!results.value.length) return
  active.value =
    (active.value + delta + results.value.length) % results.value.length
  nextTick(() => {
    listEl.value
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value ? closeSearch() : openSearch()
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closeSearch()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const hit = results.value[active.value]
    if (hit) go(hit)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <!-- Trigger: a search field on md+, icon-only on mobile. SSR-rendered. -->
    <button
      type="button"
      aria-label="搜索文档"
      class="border-kun text-default-400 hover:border-primary hover:text-default-600 flex cursor-pointer items-center gap-2 rounded-kun-md border p-2 text-sm transition-colors md:w-56 md:px-3"
      @click="openSearch"
    >
      <KunIcon name="lucide:search" class="shrink-0" />
      <span class="hidden flex-1 text-left md:inline">搜索文档…</span>
      <kbd
        class="border-kun text-default-400 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium md:inline"
      >
        {{ isMac ? '⌘' : 'Ctrl' }} K
      </kbd>
    </button>

    <Teleport to="body">
      <Transition name="kun-fade">
        <div
          v-if="open"
          class="z-kun-modal fixed inset-0 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
          @click.self="closeSearch"
        >
          <div
            class="bg-content1 border-kun rounded-kun-lg shadow-kun-lg flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden border"
          >
            <!-- input -->
            <div class="border-kun flex items-center gap-3 border-b px-4">
              <KunIcon name="lucide:search" class="text-default-400 shrink-0" />
              <input
                ref="inputEl"
                v-model="query"
                type="text"
                placeholder="搜索组件、页面…"
                class="text-foreground placeholder:text-default-400 flex-1 bg-transparent py-3.5 text-sm outline-none"
                spellcheck="false"
                autocomplete="off"
              />
              <button
                type="button"
                class="text-default-400 hover:text-default-600 cursor-pointer"
                aria-label="关闭"
                @click="closeSearch"
              >
                <KunIcon name="lucide:x" />
              </button>
            </div>

            <!-- results -->
            <div ref="listEl" class="min-h-0 flex-1 overflow-y-auto p-2">
              <ul v-if="results.length" class="flex flex-col gap-0.5">
                <li v-for="(hit, i) in results" :key="hit.doc.route">
                  <button
                    type="button"
                    :data-active="i === active"
                    class="block w-full cursor-pointer rounded-kun-md px-3 py-2 text-left transition-colors"
                    :class="i === active ? 'bg-primary/10' : 'hover:bg-default-100'"
                    @click="go(hit)"
                    @mouseenter="active = i"
                  >
                    <div class="text-default-400 mb-0.5 text-xs">
                      {{ hit.doc.section }}
                    </div>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div
                      class="text-foreground text-sm font-medium"
                      v-html="highlight(heading(hit.doc), terms)"
                    />
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div
                      v-if="hit.snippet"
                      class="text-default-400 mt-0.5 truncate text-xs"
                      v-html="highlight(hit.snippet, terms)"
                    />
                  </button>
                </li>
              </ul>

              <p
                v-else-if="query.trim()"
                class="text-default-400 px-3 py-6 text-center text-sm"
              >
                无结果:<span class="text-default-600">{{ query }}</span>
              </p>
              <p
                v-else
                class="text-default-400 px-3 py-6 text-center text-sm"
              >
                输入关键字搜索组件与页面
              </p>
            </div>

            <!-- footer hints -->
            <div
              class="border-kun text-default-400 flex items-center gap-4 border-t px-4 py-2 text-[11px]"
            >
              <span><kbd class="text-default-500">↑↓</kbd> 选择</span>
              <span><kbd class="text-default-500">↵</kbd> 打开</span>
              <span><kbd class="text-default-500">esc</kbd> 关闭</span>
              <span class="ml-auto">{{ results.length }} 条结果</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.kun-fade-enter-active,
.kun-fade-leave-active {
  transition: opacity 0.15s ease;
}
.kun-fade-enter-from,
.kun-fade-leave-to {
  opacity: 0;
}
</style>
