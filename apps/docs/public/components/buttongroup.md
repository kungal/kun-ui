# ButtonGroup (按钮组)

> 把一排 KunButton 合并成一个整体(分段操作、分裂按钮):收拢相邻圆角,并把两条 1px 边框叠成一条接缝。

## 示例

### Basic.vue

```vue
<template>
  <KunButtonGroup aria-label="Text alignment">
    <KunButton variant="bordered" color="default">Left</KunButton>
    <KunButton variant="bordered" color="default">Center</KunButton>
    <KunButton variant="bordered" color="default">Right</KunButton>
  </KunButtonGroup>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import type { KunUISize } from '@kungal/ui-core'

const sizes: KunUISize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButtonGroup v-for="size in sizes" :key="size" :aria-label="`视图模式 ${size}`">
      <KunButton :size="size" variant="bordered" color="default">列表</KunButton>
      <KunButton :size="size" variant="bordered" color="default">网格</KunButton>
      <KunButton :size="size" variant="bordered" color="default">时间线</KunButton>
    </KunButtonGroup>
  </div>
</template>
```

### Vertical.vue

```vue
<template>
  <KunButtonGroup orientation="vertical" aria-label="图片工具">
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:zoom-in" /></template>
      放大
    </KunButton>
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:zoom-out" /></template>
      缩小
    </KunButton>
    <KunButton variant="bordered" color="default" icon icon-position="left">
      <template #icon><KunIcon name="lucide:rotate-cw" /></template>
      旋转
    </KunButton>
  </KunButtonGroup>
</template>
```

### Split.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const items: KunContextMenuItem[] = [
  { key: 'draft', label: '存为草稿', icon: 'lucide:download' },
  { key: 'schedule', label: '定时发布', icon: 'lucide:calendar' },
  { key: 'discard', label: '丢弃', icon: 'lucide:x', color: 'danger' },
]
const last = ref('')
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButtonGroup aria-label="发布">
      <KunButton color="primary" @click="last = '发布'">发布</KunButton>
      <KunDropdown :items="items" @select="(item) => (last = item.label)">
        <template #trigger>
          <KunButton color="primary" :is-icon-only="true" aria-label="更多发布选项">
            <KunIcon name="lucide:chevron-down" />
          </KunButton>
        </template>
      </KunDropdown>
    </KunButtonGroup>
    <p v-if="last" class="text-default-500 text-sm">上一次操作：{{ last }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Accessible name for the group (role="group"). |
| `className` | `string` | `""` | Extra classes, merged after the component's own classes so yours wins the conflict — KunUI's `rounded-kun-*` / `shadow-kun-*` scales included. |
| `orientation` | `KunButtonGroupOrientation` | `"horizontal"` | Lay the segments out as a row or a column; the collapsed seam and the squared inner corners follow. |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/buttongroup
