# Autocomplete (自动完成)

> 组合框:文本输入 + 过滤建议列表(v-model 字符串);支持 allowCustomValue 与手动过滤。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="value"
      :options="options"
      label="City"
      placeholder="Type a city…"
    />
  </div>
</template>
```

### CustomValue.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// allowCustomValue (default true) lets the field keep what the user typed even
// when it matches no option — handy for free-form tags / emails.
const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="value"
      :options="options"
      label="Favourite colour (or type your own)"
      placeholder="Pick or type…"
      :allow-custom-value="true"
    />
    <p class="text-default-500 mt-2 text-sm">值: {{ value || '—' }}</p>
  </div>
</template>
```

### Clearable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `clearable` shows a button to reset the field text once it is non-empty.
const value = ref('東京 Tokyo')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="value"
      :options="options"
      label="City"
      placeholder="Type a city…"
      :clearable="true"
    />
  </div>
</template>
```

### ErrorDisabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `error` shows a message and marks the field invalid; `isInvalid` flags it
// invalid without a message. `disabled` blocks all interaction.
const a = ref('')
const b = ref('東京 Tokyo')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunAutocomplete
      v-model="a"
      :options="options"
      label="错误"
      placeholder="Type a city…"
      error="请选择一个有效城市"
    />
    <KunAutocomplete
      v-model="b"
      :options="options"
      label="禁用"
      :disabled="true"
    />
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `color` themes the focus ring / accent of the field.
const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunAutocomplete v-model="value" :options="options" color="primary" label="primary" />
    <KunAutocomplete v-model="value" :options="options" color="secondary" label="secondary" />
    <KunAutocomplete v-model="value" :options="options" color="success" label="success" />
    <KunAutocomplete v-model="value" :options="options" color="warning" label="warning" />
    <KunAutocomplete v-model="value" :options="options" color="danger" label="danger" />
    <KunAutocomplete v-model="value" :options="options" color="info" label="info" />
  </div>
</template>
```

### RemoteSearch.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// Pretend this lives on a server; we filter + delay it to fake a network call.
const DB: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
  { value: 'fukuoka', label: '福岡 Fukuoka' },
  { value: 'kobe', label: '神戸 Kobe' },
]

const text = ref('') // v-model = the input text
const picked = ref<string | number | null>(null) // the confirmed value (kept by us)
const options = ref<KunAutocompleteOption[]>([])
const loading = ref(false)

// A monotonically increasing id so a slow response can't overwrite a newer one.
let reqId = 0
const onSearch = async (q: string) => {
  const query = q.trim().toLowerCase()
  if (!query) {
    options.value = []
    loading.value = false
    return
  }
  const mine = ++reqId
  loading.value = true
  await new Promise((r) => setTimeout(r, 700)) // fake latency
  if (mine !== reqId) return // a newer search superseded this one — drop it
  options.value = DB.filter((o) => o.label.toLowerCase().includes(query))
  loading.value = false
}

const onSelect = (opt: KunAutocompleteOption) => {
  picked.value = opt.value // click / Enter confirms → we get the value here
}
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="text"
      :options="options"
      :loading="loading"
      :debounce="300"
      manual-filter
      :allow-custom-value="false"
      label="搜索城市（远程）"
      placeholder="输入城市名…"
      @search="onSearch"
      @select="onSelect"
    />
    <p class="text-default-500 mt-2 text-sm">
      confirmed value: <code>{{ picked ?? '—' }}</code>
    </p>
  </div>
</template>
```

### CustomOption.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Extra fields (avatar, desc) on top of the base option — the component is
// generic, so they're typed inside the #option slot.
type CityOption = {
  value: string
  label: string
  avatar: string
  desc: string
}

// A tiny self-contained SVG avatar (no network request).
const avatar = (initial: string, bg: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="${bg}"/><text x="20" y="27" font-size="18" fill="white" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`
  )

const value = ref('')
const options: CityOption[] = [
  { value: 'tokyo', label: '東京 Tokyo', avatar: avatar('東', '#e11d48'), desc: 'Japan · Kantō' },
  { value: 'osaka', label: '大阪 Osaka', avatar: avatar('大', '#2563eb'), desc: 'Japan · Kansai' },
  { value: 'kyoto', label: '京都 Kyoto', avatar: avatar('京', '#16a34a'), desc: 'Japan · Kansai' },
  { value: 'sapporo', label: '札幌 Sapporo', avatar: avatar('札', '#9333ea'), desc: 'Japan · Hokkaidō' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete v-model="value" :options="options" label="City" placeholder="Type a city…">
      <!-- `option` is typed as CityOption — avatar/desc are available. -->
      <template #option="{ option }">
        <img :src="option.avatar" alt="" class="size-8 shrink-0 rounded-full" />
        <div class="min-w-0">
          <div class="truncate font-medium">{{ option.label }}</div>
          <div class="text-default-500 truncate text-xs">{{ option.desc }}</div>
        </div>
      </template>
    </KunAutocomplete>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` * | `readonly KunAutocompleteOption[]` | — |  |
| `allowCustomValue` | `boolean` | `true` | Accept a value the user typed that is not in `options` (free text). |
| `ariaLabel` | `string` | `""` |  |
| `clearable` | `boolean` | `false` |  |
| `color` | `KunUIColor` | `"default"` | Focus-ring accent (the resting border/text stay neutral). Default 'default'. |
| `darkBorder` | `boolean` | `true` | Legacy dark-mode border toggle. |
| `debounce` | `number` | `0` | Debounce the `@search` emit by N ms; the input text still updates instantly (a responsive field). 0 (default) emits on every keystroke — set e.g. 300 for remote sources so you fetch once the user pauses, not per keypress. |
| `description` | `string` | `""` | Helper text below the field (hidden when `error` is set). |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | `""` |  |
| `isInvalid` | `boolean` | `false` |  |
| `label` | `string` | `""` |  |
| `loading` | `boolean` | `false` | Async data source: show a loading spinner in the dropdown (instead of `noResultText`) while a remote `@search` request is in flight. Drive it from your fetch — set true when the request starts, false when the results land. |
| `loadingText` | `string` | `"加载中…"` | Text under the loading spinner. Default '加载中…'. |
| `manualFilter` | `boolean` | `false` | Skip built-in label filtering — you control `options` from `@search` (remote/async suggestions). Default false (client-side filter). |
| `modelValue` | `string` | `""` |  |
| `name` | `string` | — |  |
| `noResultText` | `string` | `"无匹配项"` |  |
| `placeholder` | `string` | `""` |  |
| `rounded` | `KunUIRounded` | — | Corner radius. When unset it follows the nearest KunUIConfigProvider's `rounded`. `full` means a pill, which is only defined for the single-line trigger — the floating panel falls back to `lg`, because `9999px` on an n-row panel is clamped by the browser to half its short side. Every other bucket applies to both. |
| `size` | `KunUISize` | `"md"` |  |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `search` | `query: string` | The field text, debounced by `debounce`. One emit per committed word during IME composition, not one per romaji keystroke. |
| `select` | `option: KunAutocompleteOption` | The option the user committed by click or Enter. Free text accepted through `allowCustomValue` does not emit it. |
| `update:modelValue` | `value: string` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#option` | `{ option: KunAutocompleteOption; index: number; active: boolean; selected: boolean; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/autocomplete
