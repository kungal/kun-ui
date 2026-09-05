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

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `accept` | `string` | `""` |
| `className` | `string` | `""` |
| `description` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `files` | `File[]` | `[]` |
| `fullWidth` | `boolean` | `false` |
| `hint` | `string` | `""` |
| `maxSize` | `number` | — |
| `modelValue` | `File \| null` | `null` |
| `multiple` | `boolean` | `false` |
| `showFileName` | `boolean` | `true` |
| `triggerColor` | `KunUIColor` | `"primary"` |
| `triggerIcon` | `string` | `"lucide:upload"` |
| `triggerSize` | `KunUISize` | `"md"` |
| `triggerText` | `string` | `"选择文件"` |
| `triggerVariant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/fileinput
