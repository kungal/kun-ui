# Checkbox (复选框)

> 布尔复选框(v-model),可带标签。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const agree = ref(true)
const locked = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="agree" label="I agree to the terms" />
    <KunCheckBox v-model="locked" label="Disabled" disabled />
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(true)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="value" color="default" label="default" />
    <KunCheckBox v-model="value" color="primary" label="primary" />
    <KunCheckBox v-model="value" color="secondary" label="secondary" />
    <KunCheckBox v-model="value" color="success" label="success" />
    <KunCheckBox v-model="value" color="warning" label="warning" />
    <KunCheckBox v-model="value" color="danger" label="danger" />
    <KunCheckBox v-model="value" color="info" label="info" />
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
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="value" size="xs" color="primary" label="xs" />
    <KunCheckBox v-model="value" size="sm" color="primary" label="sm" />
    <KunCheckBox v-model="value" size="md" color="primary" label="md" />
    <KunCheckBox v-model="value" size="lg" color="primary" label="lg" />
    <KunCheckBox v-model="value" size="xl" color="primary" label="xl" />
  </div>
</template>
```

### Indeterminate.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, label: '项目 A', checked: true },
  { id: 2, label: '项目 B', checked: false },
  { id: 3, label: '项目 C', checked: false },
])

const allChecked = () => items.value.every((i) => i.checked)
const someChecked = () => items.value.some((i) => i.checked) && !allChecked()
const toggleAll = (v: boolean) => items.value.forEach((i) => (i.checked = v))
</script>

<template>
  <div class="max-w-xs">
    <KunCheckBox
      :model-value="allChecked()"
      :indeterminate="someChecked()"
      color="primary"
      label="全选"
      @change="toggleAll"
    />
    <div class="mt-2 ml-6 flex flex-col gap-1">
      <KunCheckBox
        v-for="item in items"
        :key="item.id"
        v-model="item.checked"
        color="primary"
        :label="item.label"
      />
    </div>
  </div>
</template>
```

### Single.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="a" type="single" color="success" label="单选外观（已选）" />
    <KunCheckBox v-model="b" type="single" color="primary" label="单选外观（未选）" />
  </div>
</template>
```

### Disabled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(true)
const unchecked = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="checked" disabled label="禁用（已选）" />
    <KunCheckBox v-model="unchecked" disabled label="禁用（未选）" />
  </div>
</template>
```

### Description.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const subscribe = ref(true)
const terms = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <KunCheckBox
      v-model="subscribe"
      color="primary"
      label="订阅邮件"
      description="我们会在有新内容时通知你"
    />
    <KunCheckBox
      v-model="terms"
      color="danger"
      label="我已阅读并同意条款"
      error="必须同意条款才能继续"
    />
  </div>
</template>
```

---
本页来源 · KunUI · https://ui.kungal.com/components/checkbox
