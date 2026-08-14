# CommandPalette (命令面板)

> 通用 ⌘K 命令面板外壳:触发器 + 快捷键、弹层、键盘导航、分组与高亮。搜索逻辑由你提供(v-model:query → items),库负责交互与无障碍。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KunCommandGroup, KunCommandItem } from '@kungal/ui-vue'

const open = ref(false)
const query = ref('')
const picked = ref('')

// Static commands. You compute the shown results from `query` — here a simple
// label filter, grouped by section. (Real apps plug in their own scoring.)
const COMMANDS: (KunCommandItem & { section: string })[] = [
  { value: 'home', label: '首页', section: '导航', icon: 'lucide:home' },
  { value: 'docs', label: '文档', section: '导航', icon: 'lucide:book-open' },
  { value: 'settings', label: '设置', section: '导航', icon: 'lucide:settings' },
  { value: 'new-file', label: '新建文件', section: '操作', icon: 'lucide:file-plus' },
  { value: 'copy-link', label: '复制链接', section: '操作', icon: 'lucide:link' },
  { value: 'delete', label: '删除', section: '操作', icon: 'lucide:trash-2' },
]
const groups = computed<KunCommandGroup[]>(() => {
  const q = query.value.trim().toLowerCase()
  const match = COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q))
  return ['导航', '操作']
    .map((s) => ({ label: s, items: match.filter((c) => c.section === s) }))
    .filter((g) => g.items.length)
})
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- `:shortcut="false"` here only because this page already has a ⌘K palette
         (the header search). In a real app keep the default and open with ⌘K. -->
    <KunCommandPalette
      v-model:open="open"
      v-model:query="query"
      :items="groups"
      :shortcut="false"
      placeholder="输入命令…"
      @select="(i: KunCommandItem) => (picked = String(i.value))"
    >
      <template #trigger="{ open }">
        <KunButton variant="bordered" @click="open">命令面板</KunButton>
      </template>
    </KunCommandPalette>
    <span class="text-default-500 text-sm">选中:{{ picked || '—' }}</span>
  </div>
</template>
```

### Async.vue

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { KunCommandItem } from '@kungal/ui-vue'

const open = ref(false)
const query = ref('')
const picked = ref('')
const items = ref<KunCommandItem[]>([])
const loading = ref(false)

// Pretend remote data — filter + delay to fake a network request.
const DB: KunCommandItem[] = [
  { value: 'tokyo', label: '東京 Tokyo', description: 'Japan · Kantō', icon: 'lucide:map-pin' },
  { value: 'osaka', label: '大阪 Osaka', description: 'Japan · Kansai', icon: 'lucide:map-pin' },
  { value: 'kyoto', label: '京都 Kyoto', description: 'Japan · Kansai', icon: 'lucide:map-pin' },
  { value: 'sapporo', label: '札幌 Sapporo', description: 'Japan · Hokkaidō', icon: 'lucide:map-pin' },
]

// A monotonic id so a slow response can't overwrite a newer query.
let reqId = 0
watch(query, async (q) => {
  const term = q.trim().toLowerCase()
  if (!term) {
    items.value = []
    loading.value = false
    return
  }
  const mine = ++reqId
  loading.value = true
  await new Promise((r) => setTimeout(r, 600)) // fake latency
  if (mine !== reqId) return // superseded
  items.value = DB.filter((c) => c.label.toLowerCase().includes(term))
  loading.value = false
})
</script>

<template>
  <div class="flex items-center gap-3">
    <KunCommandPalette
      v-model:open="open"
      v-model:query="query"
      :items="items"
      :loading="loading"
      :shortcut="false"
      placeholder="搜索城市…(远程)"
      empty-text="输入城市名开始搜索"
      @select="(i: KunCommandItem) => (picked = String(i.value))"
    >
      <template #trigger="{ open }">
        <KunButton variant="bordered" @click="open">远程搜索</KunButton>
      </template>
    </KunCommandPalette>
    <span class="text-default-500 text-sm">选中:{{ picked || '—' }}</span>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `""` | Accessible name for the dialog. |
| `emptyText` | `string` | `"输入关键字搜索"` | Shown when `query` is empty (a hint / "recent"). |
| `highlight` | `boolean` | `true` | Highlight the query terms in the default item render. Default `true`. |
| `items` | `readonly KunCommandItem[] \| readonly KunCommandGroup<KunCommandItem>[]` | `[]` | Results to show: a flat item list (one unlabelled group) OR grouped. You compute these from `v-model:query` — the shell does no matching itself. |
| `loading` | `boolean` | `false` | Async search in flight → a loading state instead of the no-result text. |
| `noResultText` | `string` | `"无结果"` | Shown when `query` is non-empty but there are no results. |
| `open` | `boolean` | `false` |  |
| `placeholder` | `string` | `"搜索…"` |  |
| `query` | `string` | `""` |  |
| `shortcut` | `string \| boolean` | `true` | Global open shortcut. `true` (default) = ⌘K / Ctrl-K; a single-char string sets a custom key (still with meta/ctrl); `false` disables it. |

---
本页来源 · KunUI · https://ui.kungal.com/components/commandpalette
