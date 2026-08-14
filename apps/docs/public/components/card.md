# Card (卡片)

> 带颜色、边框与悬停效果的容器;传入 href 即变为链接。

## 示例

### Basic.vue

```vue
<template>
  <KunCard class-name="max-w-sm">
    <h3 class="font-semibold">Card title</h3>
    <p class="text-default-600 mt-1 text-sm">
      A simple container with a border and padding.
    </p>
  </KunCard>
</template>
```

### Colors.vue

```vue
<template>
  <KunCard color="primary" class-name="w-32">primary</KunCard>
  <KunCard color="success" class-name="w-32">success</KunCard>
  <KunCard color="warning" class-name="w-32">warning</KunCard>
  <KunCard color="danger" class-name="w-32">danger</KunCard>
</template>
```

### Variants.vue

```vue
<template>
  <!-- 默认带边框。 -->
  <KunCard class-name="w-40">
    <span class="font-medium">bordered</span>
    <span class="text-default-500 text-sm">默认带边框</span>
  </KunCard>

  <!-- bordered=false：去掉边框。 -->
  <KunCard :bordered="false" color="default" class-name="w-40">
    <span class="font-medium">无边框</span>
    <span class="text-default-500 text-sm">bordered=false</span>
  </KunCard>

  <!-- is-transparent：透明背景、无毛玻璃模糊。 -->
  <KunCard is-transparent class-name="w-40">
    <span class="font-medium">透明</span>
    <span class="text-default-500 text-sm">is-transparent</span>
  </KunCard>
</template>
```

### Padding.vue

```vue
<template>
  <!-- padding 控制内边距:默认 lg(24px);sm(12px)更紧凑,none 用于满铺(如纯封面图)。 -->
  <KunCard padding="sm" class-name="w-40">
    <span class="font-medium">sm</span>
    <span class="text-default-500 text-sm">12px(紧凑)</span>
  </KunCard>

  <KunCard padding="md" class-name="w-40">
    <span class="font-medium">md</span>
    <span class="text-default-500 text-sm">20px</span>
  </KunCard>

  <KunCard padding="lg" class-name="w-40">
    <span class="font-medium">lg(默认)</span>
    <span class="text-default-500 text-sm">24px(舒适)</span>
  </KunCard>
</template>
```

### Hoverable.vue

```vue
<template>
  <!-- is-hoverable：鼠标悬停时高亮背景。 -->
  <KunCard is-hoverable color="default" class-name="max-w-sm">
    <h3 class="font-semibold">可悬停卡片</h3>
    <p class="text-default-600 mt-1 text-sm">将鼠标移到卡片上查看高亮效果。</p>
  </KunCard>
</template>
```

### Clickable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <!-- clickable：渲染为 <button>，带点击缩放与涟漪效果。 -->
  <KunCard clickable color="primary" class-name="max-w-sm" @click="clicks++">
    <h3 class="font-semibold">可点击卡片</h3>
    <p class="text-default-600 mt-1 text-sm">点击查看涟漪效果，已点击 {{ clicks }} 次。</p>
  </KunCard>
</template>
```

### Link.vue

```vue
<template>
  <!-- href：卡片渲染为链接（底层使用 config.linkComponent）。 -->
  <KunCard is-hoverable href="/components/button" class-name="max-w-sm">
    <h3 class="font-semibold">链接卡片 →</h3>
    <p class="text-default-600 mt-1 text-sm">点击整张卡片跳转到按钮文档。</p>
  </KunCard>
</template>
```

### Slots.vue

```vue
<template>
  <KunCard color="default" class-name="max-w-sm">
    <!-- header 插槽 -->
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">卡片标题</span>
        <KunChip color="primary" size="xs">新</KunChip>
      </div>
    </template>

    <!-- cover 插槽 -->
    <template #cover>
      <div class="bg-primary-100 text-primary flex h-28 items-center justify-center rounded-kun-lg">
        <KunIcon name="lucide:layout-grid" class="text-3xl" />
      </div>
    </template>

    <!-- 默认插槽：正文 -->
    <p class="text-default-600 text-sm">
      header、cover、footer 与默认插槽可自由组合，构建结构化卡片。
    </p>

    <!-- footer 插槽 -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <KunButton size="sm" variant="light">取消</KunButton>
        <KunButton size="sm" color="primary">确定</KunButton>
      </div>
    </template>
  </KunCard>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `bordered` | `boolean` | `true` |  |
| `className` | `string` | `""` |  |
| `clickable` | `boolean` | `false` |  |
| `color` | `KunUIColor \| "background"` | `"background"` |  |
| `contentClass` | `string` | `""` |  |
| `darkBorder` | `boolean` | `false` |  |
| `href` | `string` | `undefined` |  |
| `isHoverable` | `boolean` | `false` |  |
| `isTransparent` | `boolean` | `false` |  |
| `padding` | `KunCardPadding` | `"lg"` | Inner padding. Default `lg` (24px). |
| `rounded` | `KunUIRounded` | `undefined` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/card
