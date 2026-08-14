# Steps (步骤条)

> 多步流程(items + current):横向/纵向、完成/进行/待办状态,数据驱动且 SSR 安全。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(1)
const items: KunStepItem[] = [
  { title: '填写信息', description: '账号与昵称' },
  { title: '验证邮箱', description: '点击邮件链接' },
  { title: '完成', description: '开始使用' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-5">
    <KunSteps :items="items" :current="current" />
    <div class="flex gap-2">
      <KunButton size="sm" variant="flat" :is-disabled="current === 0" @click="current--">上一步</KunButton>
      <KunButton size="sm" :is-disabled="current === items.length - 1" @click="current++">下一步</KunButton>
    </div>
  </div>
</template>
```

### Vertical.vue

```vue
<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '已提交', description: '资源已进入审核队列', icon: 'lucide:check' },
  { title: '审核中', description: '管理员正在审核' },
  { title: '已发布' },
]
</script>

<template>
  <KunSteps :items="items" :current="1" orientation="vertical" class-name="max-w-xs" />
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '步骤一' },
  { title: '步骤二' },
  { title: '步骤三' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <KunSteps :items="items" :current="1" color="success" />
    <KunSteps :items="items" :current="1" color="warning" size="sm" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` * | `KunStepItem[]` | — |  |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` |  |
| `current` | `number` | `0` | 0-based index of the current step; earlier steps render as done. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |  |
| `size` | `KunStepsSize` | `"md"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/steps
