# Rating (评分)

> 星级评分输入(v-model number),支持只读与尺寸。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(3)
</script>

<template>
  <div class="flex items-center gap-3">
    <KunRating v-model="rating" />
    <span class="text-default-500 text-sm">{{ rating }} / 5</span>
  </div>
</template>
```

### Readonly.vue

```vue
<template>
  <div class="flex items-center gap-3">
    <KunRating :model-value="4" readonly />
    <span class="text-default-500 text-sm">只读，固定为 4 / 5</span>
  </div>
</template>
```

### Disabled.vue

```vue
<template>
  <div class="flex items-center gap-3">
    <KunRating :model-value="3" disabled />
    <span class="text-default-500 text-sm">禁用，无法交互</span>
  </div>
</template>
```

### Count.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(7)
</script>

<template>
  <div class="flex items-center gap-3">
    <KunRating v-model="rating" :max="10" />
    <span class="text-default-500 text-sm">{{ rating }} / 10</span>
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const sm = ref(3)
const md = ref(3)
const lg = ref(3)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunRating v-model="sm" size="sm" />
    <KunRating v-model="md" size="md" />
    <KunRating v-model="lg" size="lg" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | `"rating"` |
| `disabled` | `boolean` | `false` |
| `max` | `number` | `5` |
| `modelValue` | `number` | `0` |
| `readonly` | `boolean` | `false` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `set` | `value: number` | The value the user clicked. Never emitted while `readonly` or `disabled`. |
| `update:modelValue` | `value: number` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/rating
