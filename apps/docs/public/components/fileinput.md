# FileInput (文件选择)

> 样式化的文件选择按钮(v-model File | File[]),触发器可自定义。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunFileInput v-model="file" />
    <KunFileInput
      v-model="file"
      trigger-text="Upload avatar"
      trigger-color="secondary"
      accept="image/*"
    />
  </div>
</template>
```

### Multiple.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const files = ref<File[]>([])
</script>

<template>
  <div class="max-w-md">
    <KunFileInput
      v-model:files="files"
      :multiple="true"
      trigger-text="选择多个文件"
      trigger-color="secondary"
      description="可一次选择多个文件"
    />
    <ul class="text-default-600 mt-2 text-sm">
      <li v-for="f in files" :key="f.name">{{ f.name }}</li>
      <li v-if="files.length === 0" class="text-default-400">尚未选择文件</li>
    </ul>
  </div>
</template>
```

### CustomTrigger.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
</script>

<template>
  <div class="max-w-md">
    <!-- 默认插槽暴露 pick / disabled / fileName，可完全自定义触发器 -->
    <KunFileInput v-model="file" :show-file-name="false">
      <template #default="{ pick, fileName }">
        <KunButton variant="bordered" color="success" @click="pick">
          <KunIcon name="lucide:image-plus" class="mr-1 size-4" />
          {{ fileName || '点击选择图片' }}
        </KunButton>
      </template>
    </KunFileInput>
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref<File | null>(null)
const b = ref<File | null>(null)
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunFileInput v-model="a" :disabled="true" trigger-text="已禁用" />
    <KunFileInput v-model="b" error="请选择一个文件" trigger-text="必填项" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | `""` | Native `accept` filter for the picker, e.g. `"image/*"` or `".pdf,.zip"`. A filter, not a guarantee — validate on the server too. |
| `className` | `string` | `""` | Extra classes, merged after the component's own classes so yours wins the conflict — KunUI's `rounded-kun-*` / `shadow-kun-*` scales included. |
| `description` | `string` | `""` | Helper text below the trigger (hidden when `error` is set). Canonical name. |
| `disabled` | `boolean` | `false` | Blocks the picker and dims the trigger. |
| `error` | `string` | `""` | Error message below the trigger. Setting it also paints the invalid state and hides `description`. |
| `files` | `File[]` | `[]` | The picked files in `multiple` mode, two-way bound with `v-model:files`. Always an array; empty when nothing is picked. |
| `fullWidth` | `boolean` | `false` | Stretch the trigger to the container's full width. |
| `hint` | `string` | `""` | Helper text below the field. |
| `maxSize` | `number` | — | Largest accepted file, in BYTES. A file over it is rejected and reported through `error`. |
| `modelValue` | `File \| null` | `null` | The picked file, two-way bound with `v-model`. `null` when nothing is picked; stays `null` in `multiple` mode — read `v-model:files` there. |
| `multiple` | `boolean` | `false` | Allow picking more than one file. |
| `showFileName` | `boolean` | `true` | Print the picked file name (or the count, when `multiple`) next to the trigger. |
| `triggerColor` | `KunUIColor` | `"primary"` | Semantic colour of the trigger button. |
| `triggerIcon` | `string` | `"lucide:upload"` | Icon name on the trigger button. Must be one of KunUI's bundled icons — an unbundled name renders nothing. |
| `triggerSize` | `KunUISize` | `"md"` | Size of the trigger button, on the shared form-control scale. |
| `triggerText` | `string` | `"选择文件"` | Label on the trigger button. |
| `triggerVariant` | `KunUIVariant` | `"flat"` | Visual style of the trigger button (see KunButton `variant`). |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `change` | `picked: File[]` | The files that passed `accept` and `maxSize`. |
| `errorPick` | `message: string` | A human-readable reason a picked file was rejected. |
| `update:files` | `value: File[]` |  |
| `update:modelValue` | `value: File \| null` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | `{ pick: () => void; disabled: boolean; fileName: string \| null; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/fileinput
