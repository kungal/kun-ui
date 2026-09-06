# CheckboxGroup (复选框组)

> 数组 v-model 的多选表单字段:classic / pill / card 三种外观,可设数量上限并在被拦下时发出 invalid。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const platforms = ref(['windows'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'windows', label: 'Windows', description: '原生 exe，最常见的发布形式' },
  { value: 'android', label: 'Android', description: '移植版 apk' },
  { value: 'ios', label: 'iOS', description: '需要自签或 TestFlight' },
  { value: 'linux', label: 'Linux', description: '多数需要 Wine' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunCheckBoxGroup v-model="platforms" :options="options" label="支持平台" />
    <p class="text-default-500 text-sm">已选：{{ platforms.join('、') || '（无）' }}</p>
  </div>
</template>
```

### Variants.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const a = ref(['galgame'])
const b = ref(['galgame', 'anime'])
const c = ref(['anime'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'galgame', label: 'Galgame' },
  { value: 'anime', label: '动画' },
  { value: 'manga', label: '漫画' },
  { value: 'novel', label: '轻小说' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunCheckBoxGroup v-model="a" :options="options" label="classic" />
    <KunCheckBoxGroup v-model="b" :options="options" label="pill" variant="pill" orientation="horizontal" />
    <KunCheckBoxGroup v-model="c" :options="options" label="card" variant="card" orientation="horizontal" />
  </div>
</template>
```

### Card.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const selected = ref(['reply'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'reply', label: '新回复', description: '有人回复我的主题或评论', icon: 'lucide:info' },
  { value: 'patch', label: '新补丁', description: '关注的游戏有新补丁发布', icon: 'lucide:download' },
  { value: 'weekly', label: '每周精选', description: '每周一推送本周热门', icon: 'lucide:calendar' },
]
</script>

<template>
  <KunCheckBoxGroup
    v-model="selected"
    :options="options"
    variant="card"
    orientation="horizontal"
    color="secondary"
    label="邮件通知"
    :hide-indicator="true"
  />
</template>
```

### Max.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption, KunCheckBoxGroupInvalidReason } from '@kungal/ui-vue'

const tags = ref(['纯爱'])
const blocked = ref('')
const options: KunCheckBoxGroupOption[] = [
  { value: '纯爱', label: '纯爱' },
  { value: '治愈', label: '治愈' },
  { value: '悬疑', label: '悬疑' },
  { value: '喜剧', label: '喜剧' },
  { value: '奇幻', label: '奇幻' },
]

const onInvalid = (reason: KunCheckBoxGroupInvalidReason) => {
  blocked.value = reason === 'max-reached' ? '最多只能选 3 个标签' : ''
  window.setTimeout(() => (blocked.value = ''), 1600)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunCheckBoxGroup
      v-model="tags"
      :options="options"
      :max="3"
      variant="pill"
      orientation="horizontal"
      label="题材标签（最多 3 个）"
      @invalid="onInvalid"
    />
    <p class="text-warning h-5 text-sm">{{ blocked }}</p>
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const value = ref(['cg'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'cg', label: 'CG 包' },
  { value: 'bgm', label: 'BGM' },
  { value: 'voice', label: '语音', disabled: true, description: '本作无语音' },
]
const off = ref(['bgm'])
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunCheckBoxGroup v-model="value" :options="options" label="单个选项禁用" />
    <KunCheckBoxGroup v-model="off" :options="options" label="整组禁用" :disabled="true" />
  </div>
</template>
```

---
本页来源 · KunUI · https://ui.kungal.com/components/checkboxgroup
