# Chip (胶囊)

> 小巧的标签 / 胶囊,支持颜色、变体与尺寸。

## 示例

### Colors.vue

```vue
<template>
  <KunChip color="primary">primary</KunChip>
  <KunChip color="secondary">secondary</KunChip>
  <KunChip color="success">success</KunChip>
  <KunChip color="warning">warning</KunChip>
  <KunChip color="danger">danger</KunChip>
  <KunChip color="info">info</KunChip>
  <KunChip color="default">default</KunChip>
</template>
```

### Variants.vue

```vue
<template>
  <KunChip color="primary" variant="solid">solid</KunChip>
  <KunChip color="primary" variant="flat">flat</KunChip>
  <KunChip color="primary" variant="bordered">bordered</KunChip>
  <KunChip color="primary" variant="shadow">shadow</KunChip>
</template>
```

### Sizes.vue

```vue
<template>
  <KunChip color="primary" size="xs">xs</KunChip>
  <KunChip color="primary" size="sm">sm</KunChip>
  <KunChip color="primary" size="md">md</KunChip>
  <KunChip color="primary" size="lg">lg</KunChip>
  <KunChip color="primary" size="xl">xl</KunChip>
</template>
```

### Closable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['Vue', 'React', 'Solid', 'Svelte'])

const remove = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag)
}
</script>

<template>
  <KunChip
    v-for="tag in tags"
    :key="tag"
    color="primary"
    :closable="true"
    @close="remove(tag)"
  >
    {{ tag }}
  </KunChip>
  <KunChip v-if="tags.length === 0" color="default">已全部移除</KunChip>
</template>
```

### Slots.vue

```vue
<template>
  <!-- start 插槽：在文本前放一个状态圆点。 -->
  <KunChip color="success">
    <template #start>
      <span class="bg-success size-2 rounded-full" />
    </template>
    在线
  </KunChip>

  <KunChip color="warning">
    <template #start>
      <span class="bg-warning size-2 rounded-full" />
    </template>
    离开
  </KunChip>

  <!-- start 插槽：图标。 -->
  <KunChip color="primary" variant="bordered">
    <template #start>
      <KunIcon name="lucide:circle-check" class="size-3.5" />
    </template>
    已完成
  </KunChip>

  <!-- end 插槽：尾部图标。 -->
  <KunChip color="secondary" variant="flat">
    精选
    <template #end>
      <KunIcon name="lucide:zap" class="size-3.5" />
    </template>
  </KunChip>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `closable` | `boolean` | `false` |
| `color` | `KunUIColor` | `"default"` |
| `disabled` | `boolean` | `false` |
| `size` | `KunUISize` | `"sm"` |
| `variant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/chip
