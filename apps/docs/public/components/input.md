# Input (输入框)

> 文本输入框(v-model),带标签、辅助 / 错误文本与尺寸。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>

<template>
  <KunInput
    v-model="value"
    label="Username"
    placeholder="Type here…"
    description="Helper text below the field."
    class-name="max-w-xs"
  />
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="v" size="xs" placeholder="xs" />
    <KunInput v-model="v" size="sm" placeholder="sm" />
    <KunInput v-model="v" size="md" placeholder="md" />
    <KunInput v-model="v" size="lg" placeholder="lg" />
    <KunInput v-model="v" size="xl" placeholder="xl" />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('locked')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="a" label="With error" error="This field is required." />
    <KunInput v-model="b" label="Invalid (no message)" is-invalid />
    <KunInput v-model="c" label="Disabled" disabled />
  </div>
</template>
```

### Clearable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Clear me')
const password = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput
      v-model="text"
      label="可清除"
      placeholder="Type something…"
      is-clearable
    />
    <KunInput
      v-model="password"
      type="password"
      label="密码"
      placeholder="••••••••"
      reveal-password
    />
  </div>
</template>
```

### Affix.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const search = ref('')
const amount = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="search" placeholder="Search…" description="带前缀图标">
      <template #prefix>
        <KunIcon name="lucide:search" class="text-default-400 size-4" />
      </template>
    </KunInput>
    <KunInput v-model="amount" placeholder="0.00" description="带后缀单位">
      <template #prefix>
        <span class="text-default-400 text-sm">$</span>
      </template>
      <template #suffix>
        <span class="text-default-400 text-sm">USD</span>
      </template>
    </KunInput>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Focus the field on mount. Focus is moved with `preventScroll`, so it never jogs the page: an autofocused input inside a popover is at the document origin until Floating UI has positioned it, and letting the browser scroll to it there threw the page to the top. |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"default"` |  |
| `darkBorder` | `boolean` | `true` |  |
| `description` | `string` | `""` |  |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | `""` |  |
| `helperText` | `string` | `""` |  |
| `isClearable` | `boolean` | `false` |  |
| `isInvalid` | `boolean` | `false` |  |
| `label` | `string` | `""` |  |
| `modelValue` | `string \| number` | `""` |  |
| `placeholder` | `string` | `""` |  |
| `required` | `boolean` | `false` |  |
| `revealPassword` | `boolean` | `false` |  |
| `rounded` | `KunUIRounded` | — |  |
| `size` | `KunUISize` | `"md"` |  |
| `type` | `string` | `"text"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/input
