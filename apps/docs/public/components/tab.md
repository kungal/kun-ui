# Tab (标签页)

> 标签页(v-model + items),支持多种变体与方向。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const tab = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'features', textValue: 'Features' },
  { value: 'pricing', textValue: 'Pricing' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <KunTab v-model="tab" :items="items" />
    <p class="text-default-600 mt-3 text-sm">Active tab: {{ tab }}</p>
  </div>
</template>
```

### Variants.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabVariant } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const variants: KunTabVariant[] = [
  'underlined',
  'solid',
  'light',
  'bordered',
  'pills',
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="v in variants" :key="v" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ v }}</span>
      <KunTab v-model="active" :items="items" :variant="v" />
    </div>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabColor } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const colors: KunTabColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'default',
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="c in colors" :key="c" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ c }}</span>
      <KunTab v-model="active" :items="items" :color="c" variant="pills" />
    </div>
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabSize } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const sizes: KunTabSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="s in sizes" :key="s" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ s }}</span>
      <KunTab v-model="active" :items="items" :size="s" variant="solid" />
    </div>
  </div>
</template>
```

### Vertical.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:home' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:book-open' },
  { value: 'settings', textValue: 'Settings', icon: 'lucide:settings' },
]
</script>

<template>
  <div class="flex gap-10">
    <KunTab
      v-model="active"
      :items="items"
      orientation="vertical"
      variant="underlined"
      color="primary"
    />
    <KunTab
      v-model="active"
      :items="items"
      orientation="vertical"
      variant="light"
      color="secondary"
    />
  </div>
</template>
```

### Overflow.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('s1')
const items: KunTabItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: `s${i + 1}`,
  textValue: `分区 ${i + 1}`,
}))
</script>

<template>
  <!-- A horizontal strip that outgrows its container scrolls INSIDE it instead
       of widening the page — no `scrollable` flag, no manual overflow check. The
       overflowing edge fades to transparent (works on any background) and a
       chevron floats on each scrollable side. The active tab auto-scrolls into
       view, so ← / → keyboard nav always keeps the selection visible. -->
  <div class="flex max-w-sm flex-col gap-4">
    <KunTab v-model="active" :items="items" variant="underlined" />

    <!-- scroll-buttons=false keeps just the fade (Airbnb-style peek) -->
    <KunTab
      v-model="active"
      :items="items"
      variant="light"
      color="secondary"
      :scroll-buttons="false"
    />
  </div>
</template>
```

### Icons.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:home' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:book-open' },
  { value: 'settings', textValue: 'Settings', icon: 'lucide:settings' },
]
</script>

<template>
  <KunTab v-model="active" :items="items" variant="light" color="secondary" />
</template>
```

### Align.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:home' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:book-open' },
  { value: 'settings', textValue: 'Settings', icon: 'lucide:settings' },
]
const aligns = ['start', 'center', 'end'] as const
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row">
    <div v-for="a in aligns" :key="a" class="flex w-40 flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ a }}</span>
      <KunTab
        v-model="active"
        :items="items"
        orientation="vertical"
        variant="light"
        full-width
        :align="a"
      />
    </div>
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
// A single item can be disabled via `disabled: true`; the whole group can be
// disabled via the `disabled` prop on <KunTab>.
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">item disabled</span>
      <KunTab v-model="active" :items="items" variant="solid" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">group disabled</span>
      <KunTab v-model="active" :items="items" variant="solid" disabled />
    </div>
  </div>
</template>
```

### Panels.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Share `name` between <KunTab> and <KunTabPanels> to wire ARIA ids. -->
    <KunTab v-model="active" :items="items" variant="light" name="demo" />
    <KunTabPanels v-model="active" name="demo" class="mt-3">
      <KunTabPanel value="overview" class="text-default-600 text-sm">
        Overview — server-rendered into the HTML, indexable even when not active.
      </KunTabPanel>
      <KunTabPanel value="specs" class="text-default-600 text-sm">
        Specs — hidden="until-found" while inactive (findable via Ctrl+F).
      </KunTabPanel>
      <KunTabPanel value="reviews" class="text-default-600 text-sm">
        Reviews — also server-rendered; deep-linkable via text fragments.
      </KunTabPanel>
    </KunTabPanels>
  </div>
</template>
```

### LazyLoading.vue

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]

// Per-tab async state: `data` is null until the first fetch resolves; `loading`
// is true while any fetch (first load OR a refresh) is in flight.
type PanelState = { data: string | null; loading: boolean }
const state = reactive<Record<string, PanelState>>({
  overview: { data: null, loading: false },
  specs: { data: null, loading: false },
  reviews: { data: null, loading: false },
})

const fetchPanel = (value: string) => {
  const panel = state[value]!
  panel.loading = true
  // Simulated latency — swap for your real request.
  setTimeout(() => {
    panel.data = `Loaded content for "${value}" at ${new Date().toLocaleTimeString()}`
    panel.loading = false
  }, 900)
}

// Fetch a panel the first time it becomes active (pairs with mount="lazy").
const onChange = (value: string) => {
  if (state[value]!.data === null && !state[value]!.loading) fetchPanel(value)
}
// Kick off the initially-active panel too.
onChange(active.value)
</script>

<template>
  <div class="w-full max-w-md">
    <KunTab
      v-model="active"
      :items="items"
      variant="light"
      name="lazy"
      @change="onChange"
    />

    <!-- mount="lazy": a panel renders on first activation, then stays mounted. -->
    <KunTabPanels v-model="active" name="lazy" mount="lazy" class="mt-3">
      <KunTabPanel
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :loading="state[item.value]!.loading && state[item.value]!.data !== null"
      >
        <!-- First load: nothing to dim yet, so show a skeleton (at full opacity
             — DON'T pass `loading` here, or the dim would fade the skeleton too). -->
        <div v-if="state[item.value]!.data === null" class="flex flex-col gap-2">
          <KunSkeleton variant="text" width="70%" />
          <KunSkeleton variant="text" />
          <KunSkeleton variant="text" width="40%" />
        </div>

        <!-- Loaded: real content. A refresh re-sets `loading`, which DIMS this
             (the stale-while-revalidate mechanism) instead of flashing a skeleton. -->
        <div v-else class="text-default-600 flex flex-col gap-3 text-sm">
          <p>{{ state[item.value]!.data }}</p>
          <KunButton
            size="sm"
            variant="flat"
            class="self-start"
            @click="fetchPanel(item.value)"
          >
            Refresh
          </KunButton>
        </div>
      </KunTabPanel>
    </KunTabPanels>
  </div>
</template>
```

### Badge.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

// Extra fields on the item (count / dirty) are typed inside the #tab slot,
// because KunTab is generic over the item shape.
type MailTab = KunTabItem & { count?: number; dirty?: boolean }

const tab = ref('inbox')
const items: MailTab[] = [
  { value: 'inbox', textValue: '收件箱', icon: 'lucide:inbox', count: 3 },
  { value: 'drafts', textValue: '草稿', dirty: true },
  { value: 'sent', textValue: '已发送' },
]
</script>

<template>
  <div class="max-w-md">
    <!-- The #tab slot renders custom tab content; compose a KunBadge for an
         unread count or an "unsaved" dot. The sliding indicator measures the
         button, so the wider tab is tracked automatically. -->
    <KunTab v-model="tab" :items="items" variant="light">
      <template #tab="{ item }">
        <KunIcon v-if="item.icon" :name="item.icon" />
        <span>{{ item.textValue }}</span>
        <KunBadge v-if="item.count" variant="count" :count="item.count" color="primary" />
        <KunBadge v-else-if="item.dirty" variant="dot" color="danger" />
      </template>
    </KunTab>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` * | `KunTabItem[]` | — |  |
| `modelValue` * | `string` | — |  |
| `align` | `"start" \| "end" \| "center"` | `"center" (horizontal) / "start" (vertical)` | Horizontal alignment of each tab's content (icon + label) inside its box. Mainly visible on vertical / full-width tabs, where the box is wider than its content. |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` |  |
| `disableAnimation` | `boolean` | `false` |  |
| `disabled` | `boolean` | `false` |  |
| `fullWidth` | `boolean` | `false` |  |
| `iconSize` | `string` | `"1em"` |  |
| `innerClassName` | `string` | `""` |  |
| `name` | `string` | — |  |
| `orientation` | `KunTabOrientation` | `"horizontal"` |  |
| `scrollable` | `boolean` | `false` |  |
| `scrollButtons` | `boolean` | `true` |  |
| `size` | `KunTabSize` | `"md"` |  |
| `variant` | `KunTabVariant` | `"underlined"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/tab
