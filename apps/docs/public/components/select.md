# Select (选择器)

> 下拉选择框(v-model),由 options 数组驱动。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
]
</script>

<template>
  <KunSelect v-model="value" :options="options" label="Framework" class-name="max-w-xs" />
</template>
```

### Searchable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
]
</script>

<template>
  <KunSelect
    v-model="value"
    :options="options"
    label="Framework"
    :searchable="true"
    class-name="max-w-xs"
  />
</template>
```

### Multiple.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Multiple selection: v-model is an array. Pair with `searchable` to filter.
const value = ref<string[]>(['vue', 'solid'])
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunSelect
      v-model="value"
      :options="options"
      label="Frameworks"
      :multiple="true"
      :searchable="true"
    />
    <p class="text-default-500 mt-2 text-sm">值: {{ value.join(', ') || '—' }}</p>
  </div>
</template>
```

### Clearable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// `clearable` adds a button to reset the value back to null.
const value = ref<string | null>('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <KunSelect
    v-model="value"
    :options="options"
    label="Framework"
    :clearable="true"
    placeholder="None selected"
    class-name="max-w-xs"
  />
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// A single option can be disabled (`disabled: true`), or the whole control.
const value = ref('vue')
const disabledValue = ref('react')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular', disabled: true },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunSelect
      v-model="value"
      :options="options"
      label="禁用选项 (Angular)"
    />
    <KunSelect
      v-model="disabledValue"
      :options="options"
      label="禁用整个组件"
      :disabled="true"
    />
  </div>
</template>
```

### Error.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Passing `error` marks the field invalid and shows the message below it.
const value = ref<string | null>(null)
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <KunSelect
    v-model="value"
    :options="options"
    label="Framework"
    placeholder="请选择"
    error="此项为必填项"
    class-name="max-w-xs"
  />
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// `color` themes the focus ring / accent. Added in 0.22.0.
const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunSelect v-model="value" :options="options" color="primary" label="primary" />
    <KunSelect v-model="value" :options="options" color="secondary" label="secondary" />
    <KunSelect v-model="value" :options="options" color="success" label="success" />
    <KunSelect v-model="value" :options="options" color="warning" label="warning" />
    <KunSelect v-model="value" :options="options" color="danger" label="danger" />
    <KunSelect v-model="value" :options="options" color="info" label="info" />
  </div>
</template>
```

### Async.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Remote source: `manualFilter` hands filtering to you, `@search` carries the
// query (debounced by `debounce`), and `loading` keeps the list showing a
// spinner instead of "无匹配项" while the request is in flight.
const CATALOG: KunSelectOption[] = [
  { value: 'clannad', label: 'CLANNAD' },
  { value: 'kanon', label: 'Kanon' },
  { value: 'air', label: 'AIR' },
  { value: 'little-busters', label: 'Little Busters!' },
  { value: 'rewrite', label: 'Rewrite' },
  { value: 'summer-pockets', label: 'Summer Pockets' },
  { value: 'steins-gate', label: 'STEINS;GATE' },
  { value: 'chaos-head', label: 'CHAOS;HEAD' },
  { value: 'robotics-notes', label: 'ROBOTICS;NOTES' },
  { value: 'muv-luv', label: 'Muv-Luv' },
  { value: 'fate-stay-night', label: 'Fate/stay night' },
  { value: 'tsukihime', label: '月姫' },
]

const selected = ref<string[]>([])
const options = ref<KunSelectOption[]>([])
const loading = ref(false)

// A stale response must never overwrite a newer one — the last query wins, and
// `loading` stays true until the newest request lands.
let seq = 0
const onSearch = async (query: string) => {
  const mine = ++seq
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 450))
  if (mine !== seq) return
  const q = query.trim().toLowerCase()
  options.value = CATALOG.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 6)
  loading.value = false
}
</script>

<template>
  <div class="max-w-sm">
    <KunSelect
      v-model="selected"
      :options="options"
      label="收录作品"
      placeholder="搜索作品名"
      :multiple="true"
      :searchable="true"
      :manual-filter="true"
      :loading="loading"
      :debounce="300"
      search-placeholder="输入至少一个字…"
      no-result-text="没有匹配的作品"
      @search="onSearch"
    />
    <p class="text-default-500 mt-2 text-sm">
      已选 {{ selected.length }} 项：{{ selected.join('、') || '—' }}
    </p>
    <p class="text-default-500 mt-1 text-xs">
      选中一项后再搜别的词——标签不会丢，组件为当前选中的值保留了最后一次见到的 option。
    </p>
  </div>
</template>
```

### FilterBar.vue

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// A filter bar, not a form: `fullWidth: false` lets each control size to its own
// label, `popupWidth: 'auto'` stops the list inheriting a 90px trigger, and
// `maxVisibleTags` decides whether the trigger shows chips, a `+N` badge, or
// just a count. The pill look itself is consumer CSS through `classNames`.
type Work = {
  title: string
  year: number
  platform: 'PC' | 'Switch' | 'PS5'
  status: '已完成' | '进行中' | '待校对'
  tags: string[]
}

const WORKS: Work[] = [
  { title: 'CLANNAD', year: 2004, platform: 'PC', status: '已完成', tags: ['催泪', '校园'] },
  { title: 'STEINS;GATE', year: 2009, platform: 'PC', status: '已完成', tags: ['科幻', '悬疑'] },
  { title: 'Summer Pockets', year: 2018, platform: 'Switch', status: '进行中', tags: ['夏天', '催泪'] },
  { title: 'Muv-Luv Alternative', year: 2006, platform: 'PC', status: '待校对', tags: ['科幻', '战斗'] },
  { title: '月姫 -A piece of blue glass moon-', year: 2021, platform: 'PS5', status: '进行中', tags: ['奇幻', '悬疑'] },
  { title: 'Little Busters!', year: 2007, platform: 'Switch', status: '已完成', tags: ['校园', '催泪'] },
]

const tagOptions: KunSelectOption[] = [
  { value: '催泪', label: '催泪' },
  { value: '校园', label: '校园' },
  { value: '科幻', label: '科幻' },
  { value: '悬疑', label: '悬疑' },
  { value: '奇幻', label: '奇幻' },
  { value: '夏天', label: '夏天' },
  { value: '战斗', label: '战斗' },
]
const platformOptions: KunSelectOption[] = [
  { value: 'PC', label: 'PC' },
  { value: 'Switch', label: 'Switch' },
  { value: 'PS5', label: 'PS5' },
]
const statusOptions: KunSelectOption[] = [
  { value: '已完成', label: '已完成' },
  { value: '进行中', label: '进行中' },
  { value: '待校对', label: '待校对' },
]

const tags = ref<string[]>(['催泪'])
const platforms = ref<string[]>([])
const status = ref<string | null>(null)

const pill = { trigger: 'border-dashed' }

const results = computed(() =>
  WORKS.filter(
    (w) =>
      (!tags.value.length || tags.value.some((t) => w.tags.includes(t))) &&
      (!platforms.value.length || platforms.value.includes(w.platform)) &&
      (!status.value || w.status === status.value)
  )
)

const reset = () => {
  tags.value = []
  platforms.value = []
  status.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <!-- maxVisibleTags 0: no chips at all, the trigger reads "标签 · 2" -->
      <KunSelect
        v-model="tags"
        :options="tagOptions"
        :multiple="true"
        :searchable="true"
        :full-width="false"
        :max-visible-tags="0"
        popup-width="auto"
        rounded="full"
        size="sm"
        icon="lucide:filter"
        placeholder="标签"
        :class-names="pill"
        aria-label="按标签筛选"
      />

      <!-- maxVisibleTags 1: one chip, the rest collapse into +N -->
      <KunSelect
        v-model="platforms"
        :options="platformOptions"
        :multiple="true"
        :full-width="false"
        :max-visible-tags="1"
        popup-width="auto"
        rounded="full"
        size="sm"
        placeholder="平台"
        :class-names="pill"
        aria-label="按平台筛选"
      />

      <KunSelect
        v-model="status"
        :options="statusOptions"
        :full-width="false"
        :clearable="true"
        popup-width="auto"
        rounded="full"
        size="sm"
        placeholder="状态"
        :class-names="pill"
        aria-label="按状态筛选"
      />

      <KunButton size="sm" variant="light" @click="reset">重置</KunButton>
    </div>

    <ul class="mt-4 space-y-2">
      <li
        v-for="work in results"
        :key="work.title"
        class="bg-content1 border-kun rounded-kun-lg flex items-center justify-between gap-3 border px-3 py-2"
      >
        <div class="min-w-0">
          <p class="truncate font-medium">{{ work.title }}</p>
          <p class="text-default-500 text-xs">
            {{ work.year }} · {{ work.platform }} · {{ work.tags.join('／') }}
          </p>
        </div>
        <KunChip size="sm" variant="flat">{{ work.status }}</KunChip>
      </li>
      <li v-if="!results.length" class="text-default-500 py-6 text-center text-sm">
        没有符合条件的作品
      </li>
    </ul>
  </div>
</template>
```

### CustomOption.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Extra fields (avatar, desc) on top of the base option — the component is
// generic over the option shape, so they're typed inside the #option slot.
type UserOption = {
  value: string
  label: string
  avatar: string
  desc: string
}

const avatar = (initial: string, bg: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="${bg}"/><text x="20" y="27" font-size="18" fill="white" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`
  )

const value = ref<string>('kun')
const options: UserOption[] = [
  { value: 'kun', label: 'Kun', avatar: avatar('K', '#e11d48'), desc: '前端 · Vue' },
  { value: 'moe', label: 'Moe', avatar: avatar('M', '#2563eb'), desc: '设计' },
  { value: 'rin', label: 'Rin', avatar: avatar('R', '#16a34a'), desc: '后端 · Rust' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunSelect v-model="value" :options="options" label="Assignee">
      <!-- `option` is typed as UserOption — avatar/desc are available. -->
      <template #option="{ option }">
        <img :src="option.avatar" alt="" class="size-8 shrink-0 rounded-full" />
        <div class="min-w-0">
          <div class="truncate font-medium">{{ option.label }}</div>
          <div class="text-default-500 truncate text-xs">{{ option.desc }}</div>
        </div>
      </template>
    </KunSelect>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` * | `KunSelectValue \| KunSelectValue[] \| null` | — |  |
| `options` * | `readonly KunSelectOption<KunSelectValue>[]` | — |  |
| `ariaLabel` | `string` | `""` |  |
| `className` | `string` | `""` | Extra classes for the outer wrapper. Use `classNames` to reach the trigger, popup, list, options or chips. |
| `classNames` | `KunSelectClassNames` | — | Per-part class hooks (root / trigger / popup / list / option / chip), merged after the component's own classes, so yours wins the conflict — KunUI's own `rounded-kun-*` / `shadow-kun-*` / `z-kun-*` scales included. `rounded` is still the right tool for the trigger and popup radius; `classNames.chip` is the only way to reach a chip. |
| `clearable` | `boolean` | `false` | Show an X to reset the selection (single) — chips already remove per-item. |
| `color` | `KunUIColor` | `"default"` | Focus-ring accent (the resting border/text stay neutral). |
| `darkBorder` | `boolean` | `true` | Legacy dark-mode border toggle. |
| `debounce` | `number` | `0` | Debounce the `@search` emit by N ms; the filter field itself still updates instantly. 0 (default) emits on every keystroke — set e.g. 300 for a remote source so you fetch once the user pauses, not per keypress. |
| `description` | `string` | `""` | Helper text under the field (hidden when `error` is set). |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | `""` |  |
| `fullWidth` | `boolean` | `true` | Stretch the control to its container. Turn it off in a filter bar, so the trigger shrinks to its own content. The wrapper shrink-wraps its widest child, so a long `label`, `description` or `error` widens it too — a filter pill wants none of those. |
| `icon` | `string` | — | Icon rendered before the value in the trigger — a filter glyph for a filter bar, a category glyph for a field. Must be one of the bundled icon names. |
| `label` | `string` | `""` |  |
| `loading` | `boolean` | `false` | Async data source: show a spinner in the list (instead of `noResultText`) while a remote `@search` request is in flight. Drive it from your fetch — true when the request starts, false when the results land. |
| `loadingText` | `string` | `"加载中…"` | Text under the loading spinner. |
| `manualFilter` | `boolean` | `false` | Skip the built-in label filter — you own `options` and drive them from `@search` (remote/async suggestions). Requires `searchable`. |
| `maxVisibleTags` | `number` | — | How many chips a `multiple` trigger renders before collapsing the rest into a `+N` badge. `0` renders no chips at all and the trigger reads `{placeholder} · {n}`, or a bare count when there is no placeholder — what a filter pill wants, and what keeps a filter bar from growing a row per selection. Unset renders every chip. |
| `multiple` | `boolean` | `false` | Multi-select: v-model becomes an array; the trigger shows removable chips and the list stays open while toggling. |
| `name` | `string` | — | Native form field name — emits hidden input(s) so the value is collected by the surrounding <form> / FormData. |
| `noResultText` | `string` | `"无匹配项"` | Shown when the filter matches nothing. |
| `placeholder` | `string` | `""` |  |
| `popupWidth` | `KunSelectPopupWidth` | `"trigger"` | Popup width. The default pins it to the trigger, which is wrong the moment the trigger is a short pill — a 90px trigger gets a 90px list. `'auto'` sizes to the content and keeps the trigger width as a floor. Every mode but `'trigger'` is capped to the viewport, so a fixed width chosen for a desktop layout cannot hang off the edge of a phone. |
| `rounded` | `KunUIRounded` | — | Corner radius. When unset it follows the nearest KunUIConfigProvider's `rounded`. `full` means a pill, which is only defined for the single-line trigger — the floating panel falls back to `lg`, because `9999px` on an n-row panel is clamped by the browser to half its short side. Every other bucket applies to both. |
| `searchable` | `boolean` | `false` | Render a filter input at the top of the list. Also the switch that enables `@search` / `manualFilter` — without it there is nothing to type into. |
| `searchPlaceholder` | `string` | `"搜索…"` |  |
| `size` | `KunUISize` | `"md"` |  |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `search` | `query: string` | The filter text, debounced by `debounce`. Requires `searchable`. Also fired with `''` (immediately) when the popup opens, so a remote source can load its first page. |
| `set` | `value: KunSelectValue, index: number` | The option the user just picked and its index in `options`. Fires on every pick, including each toggle in `multiple`; `update:modelValue` carries the whole value. |
| `update:modelValue` | `value: KunSelectValue \| KunSelectValue[] \| null` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#option` | `{ option: KunSelectOption<KunSelectValue>; index: number; active: boolean; selected: boolean; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/select
