<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { KunCommandGroup, KunCommandItem } from '@kungal/ui-vue'

type Kind = 'recent' | 'clear' | 'search' | 'topic' | 'galgame' | 'user'
type Row = KunCommandItem & { kind: Kind }

const TOPICS = [
  { label: '千恋＊万花 全线攻略与结局顺序', description: '攻略 · 342 回复' },
  { label: '魔女的夜宴 汉化补丁更新到 1.2', description: '补丁 · 128 回复' },
  { label: 'Summer Pockets REFLECTION BLUE 值得补吗', description: '讨论 · 96 回复' },
  { label: '2026 年度 Galgame 投票结果出炉', description: '公告 · 1.1k 回复' },
]
const GALGAMES = [
  { label: '千恋＊万花', description: 'ゆずソフト · 2016' },
  { label: '魔女的夜宴', description: 'ゆずソフト · 2015' },
  { label: 'Riddle Joker', description: 'ゆずソフト · 2018' },
  { label: 'Summer Pockets', description: 'Key · 2018' },
  { label: '樱之诗 —在樱花之森上飞舞—', description: '枕 · 2015' },
]
const USERS = [
  { label: '鲲', description: '@kun · 1.2k 话题' },
  { label: '樱花庄的千寻', description: '@chihiro · 86 话题' },
]

const query = ref('')
const recents = ref(['千恋万花', 'Summer Pockets 汉化', 'ゆずソフト'])
const last = ref('—')

// The app owns the debounce and the request; the field only renders. Loading is
// set at once so the field shows its spinner during the debounce too.
const loading = ref(false)
const results = ref<KunCommandGroup<Row>[]>([])
let timer: ReturnType<typeof setTimeout> | undefined

const match = (q: string, rows: { label: string; description: string }[]) =>
  rows.filter((r) => `${r.label} ${r.description}`.toLowerCase().includes(q))

watch(query, (raw) => {
  clearTimeout(timer)
  const q = raw.trim().toLowerCase()
  if (!q) {
    loading.value = false
    results.value = []
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    const groups: [string, Kind, string, { label: string; description: string }[]][] = [
      ['话题', 'topic', 'lucide:messages-square', match(q, TOPICS)],
      ['Galgame', 'galgame', 'lucide:book-open', match(q, GALGAMES)],
      ['用户', 'user', 'lucide:at-sign', match(q, USERS)],
    ]
    results.value = groups
      .filter(([, , , hits]) => hits.length)
      .map(([label, kind, icon, hits]) => ({
        label: `${label} · ${hits.length}`,
        items: hits.slice(0, 3).map((h) => ({ ...h, kind, icon, value: `${kind}:${h.label}` })),
      }))
    loading.value = false
  }, 450)
})
onBeforeUnmount(() => clearTimeout(timer))

const items = computed<KunCommandGroup<Row>[]>(() => {
  const q = query.value.trim()
  if (!q) {
    if (!recents.value.length) return []
    return [
      {
        label: '最近搜索',
        items: [
          ...recents.value.map((r) => ({
            value: `recent:${r}`,
            label: r,
            icon: 'lucide:clock',
            removable: true,
            kind: 'recent' as const,
          })),
          { value: 'clear', label: '清空搜索记录', icon: 'lucide:trash-2', kind: 'clear' as const },
        ],
      },
    ]
  }
  return [
    { items: [{ value: 'search', label: `搜索「${q}」`, icon: 'lucide:search', kind: 'search' }] },
    ...results.value,
  ]
})

const goSearch = (q: string) => {
  recents.value = [q, ...recents.value.filter((r) => r !== q)].slice(0, 5)
  last.value = `前往搜索页:${q}`
}

const onSelect = (row: Row) => {
  if (row.kind === 'clear') recents.value = []
  else if (row.kind === 'recent') goSearch(row.label)
  else if (row.kind === 'search') goSearch(query.value.trim())
  else last.value = `打开${row.kind === 'user' ? '用户' : row.kind === 'topic' ? '话题' : 'Galgame'}:${row.label}`
}
const onRemove = (row: Row) => {
  recents.value = recents.value.filter((r) => r !== row.label)
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div
      class="bg-content1 border-kun rounded-kun-lg flex items-center gap-4 border px-4 py-2.5"
    >
      <span class="text-foreground hidden shrink-0 font-semibold sm:inline">KunGalgame</span>
      <KunCommandSearch
        v-model:query="query"
        :items="items"
        :loading="loading"
        :shortcut="false"
        placeholder="搜索话题、Galgame、用户…"
        class-name="max-w-[440px]"
        @select="onSelect"
        @submit="goSearch"
        @remove="onRemove"
      />
      <KunButton size="sm" class-name="ml-auto shrink-0">发帖</KunButton>
    </div>
    <p class="text-foreground-muted text-sm">最近一次:{{ last }}</p>
  </div>
</template>
