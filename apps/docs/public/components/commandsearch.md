# CommandSearch (顶栏搜索)

> 常驻的搜索框,聚焦时在下方展开分组结果:最近搜索、搜索建议、回车前往搜索页。和 CommandPalette 共用条目与渲染,但没有对话框,焦点始终留在输入框。

## 示例

### Basic.vue

```vue
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

// The app owns the debounce and the request; the field only renders. 200 ms is
// the debounce Algolia recommends ("delays of over 300 ms will start degrading
// the user experience"); FAKE_LATENCY_MS stands in for the network round trip.
// Loading is set at once so the field shows its spinner during the debounce too.
const DEBOUNCE_MS = 200
const FAKE_LATENCY_MS = 250
const loading = ref(false)
const results = ref<KunCommandGroup<Row>[]>([])
let timer: ReturnType<typeof setTimeout> | undefined

const match = (q: string, rows: { label: string; description: string }[]) =>
  rows.filter((r) => `${r.label} ${r.description}`.toLowerCase().includes(q))

const runSearch = (q: string) => {
  const groups: [string, Kind, string, { label: string; description: string }[]][] = [
    ['话题', 'topic', 'lucide:reply', match(q, TOPICS)],
    ['Galgame', 'galgame', 'lucide:image', match(q, GALGAMES)],
    ['用户', 'user', 'lucide:at-sign', match(q, USERS)],
  ]
  results.value = groups
    .filter(([, , , hits]) => hits.length)
    .map(([label, kind, icon, hits]) => ({
      label: `${label} · ${hits.length}`,
      items: hits.slice(0, 3).map((h) => ({ ...h, kind, icon, value: `${kind}:${h.label}` })),
    }))
  loading.value = false
}

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
    timer = setTimeout(() => runSearch(q), FAKE_LATENCY_MS)
  }, DEBOUNCE_MS)
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
```

### Responsive.vue

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KunCommandItem } from '@kungal/ui-vue'

// One query and one item list feed both: the field from md up, the palette's
// icon button below it. Breakpoint classes pick which one is on screen, so the
// server renders the right one for every width.
const PAGES: KunCommandItem[] = [
  { value: 'senren', label: '千恋＊万花', description: 'ゆずソフト · 2016', icon: 'lucide:image' },
  { value: 'sabbat', label: '魔女的夜宴', description: 'ゆずソフト · 2015', icon: 'lucide:image' },
  { value: 'pockets', label: 'Summer Pockets', description: 'Key · 2018', icon: 'lucide:image' },
  { value: 'sakura', label: '樱之诗', description: '枕 · 2015', icon: 'lucide:image' },
]

const query = ref('')
const open = ref(false)
const last = ref('—')

const items = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? PAGES.filter((p) => `${p.label} ${p.description}`.toLowerCase().includes(q)) : []
})

const onSelect = (item: KunCommandItem) => (last.value = `打开:${item.label}`)
const onSubmit = (q: string) => {
  last.value = `前往搜索页:${q}`
  open.value = false
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div
      class="bg-content1 border-kun rounded-kun-lg flex items-center gap-4 border px-4 py-2.5"
    >
      <span class="text-foreground shrink-0 font-semibold">KunGalgame</span>
      <KunCommandSearch
        v-model:query="query"
        :items="items"
        :shortcut="false"
        placeholder="搜索 Galgame…"
        class-name="hidden max-w-80 md:block"
        @select="onSelect"
        @submit="onSubmit"
      />
      <KunCommandPalette
        v-model:open="open"
        v-model:query="query"
        :items="items"
        :shortcut="false"
        placeholder="搜索 Galgame…"
        @select="onSelect"
        @submit="onSubmit"
      >
        <template #trigger="{ open: openPalette }">
          <KunButton
            variant="light"
            size="sm"
            is-icon-only
            aria-label="搜索"
            class-name="ml-auto md:hidden"
            @click="openPalette"
          >
            <KunIcon name="lucide:search" />
          </KunButton>
        </template>
      </KunCommandPalette>
    </div>
    <p class="text-foreground-muted text-sm">最近一次:{{ last }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `""` | Accessible name for the field. |
| `className` | `string` | — | Classes for the root wrapper: give it the field's width here. |
| `highlight` | `boolean` | `true` | Highlight the query terms in the default item render. |
| `items` | `readonly KunCommandItem[] \| readonly KunCommandGroup<KunCommandItem>[]` | `[]` | Results to show under the field: a flat item list (one unlabelled group) OR grouped, the same shape KunCommandPalette takes. With an empty `query` these are what focus shows (recent searches, say). You compute them from `v-model:query`; the field does no matching itself. |
| `loading` | `boolean` | `false` | Async search in flight: the field's search icon becomes a spinner. With no rows to show, the panel shows a loading state instead of the no-result text; rows already showing stay until new ones arrive, so the list does not blink on every keystroke. |
| `maxHeight` | `number` | `420` | Upper bound on the panel's height in px. The panel is also never taller than the room below the field. |
| `noResultText` | `string` | `locale commandPalette.noResult` | Shown when `query` is non-empty but there are no results. |
| `placeholder` | `string` | `locale commandPalette.placeholder` | Placeholder in the field; also its accessible name when `ariaLabel` is unset. |
| `query` | `string` | `""` |  |
| `rounded` | `KunUIRounded` | `the KunUI config `rounded`` | Corner radius of the field; the panel follows it. |
| `shortcut` | `string \| boolean` | `true` | Shortcut that focuses the field from anywhere. `true` (default) = ⌘K / Ctrl-K; a single-char string sets a custom key (still with meta/ctrl); `false` disables it. A hidden field ignores it, so a KunCommandPalette shown in its place on narrow screens takes the same shortcut. |
| `size` | `KunUISize` | `"md"` | Field size. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `remove` | `item: KunCommandItem` | The remove button or Shift+Delete on a `removable` row. Drop the item from `items`; the highlight stays on the row that takes its place. |
| `select` | `item: KunCommandItem` | The row the user clicked, or highlighted with the arrow keys and confirmed with Enter. A disabled row never emits. |
| `submit` | `query: string` | Enter with no row highlighted, carrying the trimmed query: the way to the full search page. Nothing is highlighted until an arrow key moves onto a row, so Enter after typing always lands here. |
| `update:query` | `value: string` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#empty` | — |
| `#footer` | — |
| `#item` | `{ item: KunCommandItem; active: boolean; index: number; highlight: (text: string) => string; }` |
| `#loading` | — |
| `#no-result` | `{ query: string; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/commandsearch
