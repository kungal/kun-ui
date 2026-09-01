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
| `autoGrow` | `boolean` | `false` |  |
| `color` | `KunUIColor` | `"default"` |  |
| `darkBorder` | `boolean` | `true` |  |
| `description` | `string` | `""` |  |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | `""` |  |
| `hint` | `string` | `""` |  |
| `label` | `string` | `""` |  |
| `maxHeight` | `string` | `""` |  |
| `maxlength` | `number` | `100007` |  |
| `minlength` | `number` | `1` |  |
| `modelValue` | `string` | `""` |  |
| `name` | `string` | `""` |  |
| `placeholder` | `string` | `""` |  |
| `readonly` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `resize` | `"none" \| "horizontal" \| "vertical" \| "both"` | `"none"` |  |
| `rounded` | `KunUIRounded` | `undefined` |  |
| `rows` | `number` | `4` |  |
| `showCharCount` | `boolean` | `false` |  |
| `size` | `KunUISize` | `"md"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/textarea
