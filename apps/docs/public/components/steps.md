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
  <KunSteps :items="items" :current="1" orientation="vertical" class-name="w-full max-w-xs" />
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

### Clickable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(2)
const items: KunStepItem[] = [
  { title: '填写信息', description: '账号与昵称' },
  { title: '验证邮箱', description: '点击邮件链接' },
  { title: '设置头像', description: '可以稍后再改' },
  { title: '完成', description: '开始使用' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-5">
    <!-- v-model:current 让已走过的步骤可点击回退；前进仍只能走「下一步」 -->
    <KunSteps v-model:current="current" :items="items" />
    <div class="flex gap-2">
      <KunButton size="sm" variant="flat" :is-disabled="current === 0" @click="current--">上一步</KunButton>
      <KunButton size="sm" :is-disabled="current === items.length - 1" @click="current++">下一步</KunButton>
    </div>
  </div>
</template>
```

### NonLinear.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(0)
const items: KunStepItem[] = [
  { title: '下载本体', description: '游戏本体' },
  { title: '下载补丁', description: '翻译 / 破解' },
  { title: '打补丁', description: '图文教程' },
]
const guides = [
  '从下方镜像任选其一下载游戏本体，解压到不含中文的路径。',
  '按游戏版本挑选汉化补丁，注意与本体版本号一致。',
  '将补丁文件覆盖到游戏根目录，以管理员身份运行启动器。',
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <!-- :linear="false"：引导类流程，任意一步都能直接点过去 -->
    <KunSteps v-model:current="current" :items="items" :linear="false" size="sm" />
    <KunCard bordered padding="md">
      <p class="text-sm">{{ guides[current] }}</p>
    </KunCard>
  </div>
</template>
```

### Error.vue

```vue
<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '达成条件' },
  { title: '提交申请' },
  { title: '管理员审核', status: 'error' },
  { title: '成为创作者' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <KunSteps :items="items" :current="2" size="sm" />
    <KunInfo
      color="danger"
      variant="flat"
      icon="lucide:circle-x"
      title="申请未通过"
      description="已合并的词条更新请求不足 3 条，补足后可以重新提交。"
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` * | `KunStepItem[]` | — | The steps, in order. |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` | Colour of the done and current steps. |
| `current` | `number` | `0` | 0-based index of the current step; earlier steps render as done. Bind it with `v-model:current` to make the steps clickable — with a plain `:current` they are display-only. |
| `linear` | `boolean` | `true` | With `v-model:current` bound: `true` lets a click go back to any earlier step but never forward, so forward moves stay behind your own "next" button and its validation; `false` makes every step reachable. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal lays titles under the indicators; vertical stacks the steps with titles beside them. |
| `size` | `KunStepsSize` | `"md"` | Indicator and title size. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `update:current` | `index: number` | A step was clicked; carries its 0-based index. Never fires for the current step, a `disabled` one, or — while `linear` — one after `current`. |

---
本页来源 · KunUI · https://ui.kungal.com/components/steps
