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

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `KunSelectValue \| KunSelectValue[] \| null` | — |
| `options` * | `readonly KunSelectOption<KunSelectValue>[]` | — |
| `ariaLabel` | `string` | `""` |
| `className` | `string` | `""` |
| `clearable` | `boolean` | `false` |
| `color` | `KunUIColor` | `"default"` |
| `darkBorder` | `boolean` | `true` |
| `description` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `label` | `string` | `""` |
| `multiple` | `boolean` | `false` |
| `name` | `string` | `undefined` |
| `noResultText` | `string` | `"无匹配项"` |
| `placeholder` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |
| `searchable` | `boolean` | `false` |
| `searchPlaceholder` | `string` | `"搜索…"` |
| `size` | `KunUISize` | `"md"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/select
