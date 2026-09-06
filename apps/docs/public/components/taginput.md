# TagInput (标签输入)

> 标签输入(v-model string[]),支持分隔符、校验与计数。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['vue', 'nuxt'])
</script>

<template>
  <KunTagInput
    v-model="tags"
    label="Tags"
    placeholder="Add a tag, press Enter…"
    :max-tags="8"
    show-counter
    class-name="max-w-md"
  />
</template>
```

### Variants.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
const c = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" variant="bordered" label="bordered（默认）" />
    <KunTagInput v-model="b" variant="flat" label="flat" />
    <KunTagInput v-model="c" variant="flat" color="secondary" label="flat · secondary" />
  </div>
</template>
```

### Limits.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref<string[]>(['vue', 'nuxt'])
</script>

<template>
  <div class="max-w-md">
    <KunTagInput
      v-model="tags"
      label="技术栈"
      placeholder="输入后回车，或用逗号 / 分号分隔"
      :max-tags="5"
      :split-chars="[',', '，', ';', ' ']"
      :show-counter="true"
    />
    <p class="text-default-400 mt-1 text-xs">最多 5 个标签，支持粘贴批量拆分</p>
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" label="禁用" :disabled="true" />
    <KunTagInput v-model="b" label="标签" error="至少需要一个标签" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `allowDuplicates` | `boolean` | `false` | Accept a tag that is already in the list. Off by default; a repeat emits `invalid` with `duplicate`. |
| `caseSensitive` | `boolean` | `false` | Treat `Vue` and `vue` as different tags when checking for duplicates. |
| `className` | `string` | `""` | Extra classes for the bordered field. Use `classNames` to reach the outer wrapper, the tags or the text input. |
| `classNames` | `KunTagInputClassNames` | — | Per-part class hooks, merged after the component's own classes so yours wins the conflict — KunUI's own `rounded-kun-*` / `shadow-kun-*` scales included. |
| `color` | `KunUIColor` | `"primary"` | Focus-ring accent; the resting border stays neutral. |
| `confirmOnBlur` | `boolean` | `true` | Commit whatever is half-typed in the field when it loses focus, instead of discarding it. |
| `description` | `string` | `""` | Helper text below the field (hidden when `error` is set). Canonical name. |
| `disabled` | `boolean` | `false` | Blocks input and dims the field. |
| `error` | `string` | `""` | Error message below the field. Setting it also paints the invalid state and hides `description`. |
| `helperText` | `string` | `""` | Helper text below the field. |
| `label` | `string` | `""` | Visible label above the field. |
| `maxTagLength` | `number` | `100` | Longest accepted tag, in characters. Default 100. |
| `maxTags` | `number` | `Number.POSITIVE_INFINITY` | Cap on how many tags can be added. Reaching it emits `invalid` with `max-reached`. |
| `minTagLength` | `number` | `1` | Shortest accepted tag, in characters. Default 1, i.e. no empty tags. |
| `modelValue` | `string[]` | `[]` | The tags, two-way bound with `v-model`. Every add and remove writes a new array — the model is never mutated in place. |
| `placeholder` | `string` | `""` | Placeholder shown in the text input while it is empty. |
| `readonly` | `boolean` | `false` | Tags stay visible but cannot be added or removed. |
| `respectComposition` | `boolean` | `true` | Ignore Enter while an IME composition is in progress, so confirming Chinese/Japanese/Korean candidates does not add a tag by accident. |
| `rounded` | `KunUIRounded` | — | Radius of the field. It deliberately does not reach the tags: a tag IS a `<KunChip>` and stays a pill at every setting, so a `KunChip` next to the field and a tag inside it never disagree. Reach a tag with `classNames.chip`. |
| `showCounter` | `boolean` | `false` | Show a live `used / maxTags` counter. Hidden when `maxTags` is unset. |
| `size` | `KunUISize` | `"md"` | Height, padding and font size, on the shared form-control scale. |
| `splitChars` | `(string \| RegExp)[]` | `["\n", ",", "，", ";"]` | Characters (or patterns) that end a tag as you type. Default `["\n", ",", "，", ";"]` — the full-width comma is there because a CJK keyboard produces it without the user noticing. |
| `splitOnPaste` | `boolean` | `true` | Split pasted text on `splitChars`, so a pasted list becomes many tags instead of one. |
| `transform` | `((raw: string) => string)` | — | Normalise a raw entry before it is validated and added — lowercasing, stripping a leading `#`, and so on. Runs after `trim`. |
| `trim` | `boolean` | `true` | Strip leading and trailing whitespace before a tag is added. |
| `validate` | `KunTagInputValidator` | — | Custom rule run on every candidate tag. Return `true` to accept, or a message string to reject; the message arrives with the `invalid` event. |
| `variant` | `KunTagInputVariant` | `"flat"` | Field style: `bordered` outline, or `flat` filled with no border. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `add` | `tag: string` | A tag that passed every check and is now in the model. |
| `invalid` | `reason: KunTagInputInvalidReason, raw: string, detail?: string` | Why an entry was rejected, plus the raw text. `detail` carries the message returned by a `validate` function. |
| `remove` | `tag: string, index: number` | The tag that was removed and the index it held. |
| `update:modelValue` | `value: string[]` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#tag` | `{ tag: string; index: number; remove: () => void; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/taginput
