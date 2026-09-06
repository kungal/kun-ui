# Textarea (文本域)

> 多行输入(v-model),支持自动增高、调整大小与字数统计。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="max-w-md">
    <KunTextarea
      v-model="text"
      label="Bio"
      placeholder="Tell us about yourself"
      description="A short description about yourself."
      :rows="4"
    />
  </div>
</template>
```

### AutoGrow.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="max-w-md">
    <KunTextarea
      v-model="text"
      label="Bio"
      placeholder="高度随内容自动增长,并显示字数"
      :rows="2"
      :maxlength="200"
      auto-grow
      show-char-count
    />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('Locked content')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <KunTextarea v-model="a" label="With error" error="Please enter a message." :rows="3" />
    <KunTextarea v-model="b" label="Disabled" disabled :rows="3" />
    <KunTextarea v-model="a" label="Small" size="sm" placeholder="size=sm" :rows="3" />
    <KunTextarea v-model="a" label="Large" size="lg" placeholder="size=lg" :rows="3" />
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <KunTextarea v-model="text" color="primary" placeholder="primary" :rows="2" />
    <KunTextarea v-model="text" color="secondary" placeholder="secondary" :rows="2" />
    <KunTextarea v-model="text" color="success" placeholder="success" :rows="2" />
    <KunTextarea v-model="text" color="warning" placeholder="warning" :rows="2" />
    <KunTextarea v-model="text" color="danger" placeholder="danger" :rows="2" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Focus the field on mount. Focus is moved with `preventScroll`, so it never jogs the page: an autofocused input inside a popover is at the document origin until Floating UI has positioned it, and letting the browser scroll to it there threw the page to the top. |
| `autoGrow` | `boolean` | `false` | Grow the field with its content up to `maxHeight`, instead of scrolling at a fixed `rows`. |
| `color` | `KunUIColor` | `"default"` | Focus-ring accent (the resting border/text stay neutral). Default 'default'. |
| `darkBorder` | `boolean` | `true` | Legacy dark-mode border toggle. |
| `description` | `string` | `""` | Helper text below the field (hidden when `error` is set). Canonical name. |
| `disabled` | `boolean` | `false` | Blocks input and dims the field. |
| `error` | `string` | `""` | Error message below the field. Setting it also paints the invalid state and hides `description`. |
| `hint` | `string` | `""` | Helper text below the field. |
| `label` | `string` | `""` | Visible label above the field, tied to it by `id` so a click focuses the textarea. |
| `maxHeight` | `string` | `""` | Ceiling for `autoGrow`, any CSS length (e.g. `"12rem"`). The field scrolls internally past it instead of growing forever. |
| `maxlength` | `number` | `100007` | Native maximum length. Also the denominator of `showCharCount`. |
| `minlength` | `number` | `1` | Native minimum length, enforced by form validation. |
| `modelValue` | `string` | `""` | The textarea's text, two-way bound with `v-model`. |
| `name` | `string` | `""` | Native form field name, for an uncontrolled `<form>` submit. |
| `placeholder` | `string` | `""` | Placeholder text. It is not a label — pair it with `label` or `ariaLabel`. |
| `readonly` | `boolean` | `false` | Value is selectable and copyable but not editable — unlike `disabled`, it stays focusable and is still submitted. |
| `required` | `boolean` | `false` | Marks the field required for native validation and assistive tech. |
| `resize` | `"none" \| "horizontal" \| "vertical" \| "both"` | `"none"` | Which way the user may drag the native resize handle. |
| `rounded` | `KunUIRounded` | — | Corner radius. Unset follows the app-wide config (default `md`). |
| `rows` | `number` | `4` | Initial visible rows — the field's height before `autoGrow` takes over. |
| `showCharCount` | `boolean` | `false` | Show a live `used / maxlength` counter under the field. Needs `maxlength` to show the denominator. |
| `size` | `KunUISize` | `"md"` | Height, padding and font size, on the shared form-control scale. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `blur` | `event: FocusEvent` |
| `focus` | `event: FocusEvent` |
| `input` | `event: Event` |
| `update:modelValue` | `value: string` |

---
本页来源 · KunUI · https://ui.kungal.com/components/textarea
