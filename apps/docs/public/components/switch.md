# Switch (开关)

> 布尔开关(v-model),可带标签。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="on" label="Notifications" />
    <KunSwitch v-model="off" label="Disabled" disabled />
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="value" size="xs" label="xs" />
    <KunSwitch v-model="value" size="sm" label="sm" />
    <KunSwitch v-model="value" size="md" label="md" />
    <KunSwitch v-model="value" size="lg" label="lg" />
    <KunSwitch v-model="value" size="xl" label="xl" />
  </div>
</template>
```

### Description.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const notify = ref(true)
const sync = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <KunSwitch v-model="notify" label="邮件通知" description="有新消息时我们会发邮件给你" />
    <KunSwitch v-model="sync" label="自动同步" description="在所有设备间保持数据一致" />
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="on" disabled label="禁用（开启）" />
    <KunSwitch v-model="off" disabled label="禁用（关闭）" />
  </div>
</template>
```

### Error.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const accept = ref(false)
</script>

<template>
  <KunSwitch
    v-model="accept"
    label="启用双重验证"
    error="为了账号安全，请开启此选项"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `boolean` | — |
| `className` | `string` | `""` |
| `description` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `label` | `string` | `""` |
| `labelClassName` | `string` | `""` |
| `size` | `KunUISize` | `"md"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/switch
