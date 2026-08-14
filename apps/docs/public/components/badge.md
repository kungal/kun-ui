# Badge (徽标)

> 包裹触发元素的计数或圆点角标;max 限制显示的最大计数。

## 示例

### Basic.vue

```vue
<template>
  <KunBadge :count="5">
    <KunButton variant="bordered">收件箱</KunButton>
  </KunBadge>
  <KunBadge :count="12">
    <KunButton variant="bordered">消息</KunButton>
  </KunBadge>
</template>
```

### Dot.vue

```vue
<template>
  <!-- variant="dot" 只显示一个小圆点，不显示数字。 -->
  <KunBadge variant="dot" color="success">
    <KunButton variant="bordered">状态</KunButton>
  </KunBadge>
  <KunBadge variant="dot" color="danger">
    <span class="border-kun inline-flex size-10 items-center justify-center rounded-kun-lg border">
      <KunIcon name="lucide:messages-square" class="text-xl" />
    </span>
  </KunBadge>
</template>
```

### Max.vue

```vue
<template>
  <!-- 当 count 超过 max 时，显示为 `max+`。 -->
  <KunBadge :count="8" :max="99">
    <KunButton variant="bordered">8</KunButton>
  </KunBadge>
  <KunBadge :count="120" :max="99">
    <KunButton variant="bordered">120 → 99+</KunButton>
  </KunBadge>
  <KunBadge :count="2000" :max="999" color="primary">
    <KunButton variant="bordered">2000 → 999+</KunButton>
  </KunBadge>
</template>
```

### Colors.vue

```vue
<template>
  <KunBadge :count="5" color="primary">
    <KunButton variant="bordered">primary</KunButton>
  </KunBadge>
  <KunBadge :count="5" color="secondary">
    <KunButton variant="bordered">secondary</KunButton>
  </KunBadge>
  <KunBadge :count="5" color="success">
    <KunButton variant="bordered">success</KunButton>
  </KunBadge>
  <KunBadge :count="5" color="warning">
    <KunButton variant="bordered">warning</KunButton>
  </KunBadge>
  <KunBadge :count="5" color="danger">
    <KunButton variant="bordered">danger</KunButton>
  </KunBadge>
  <KunBadge :count="5" color="info">
    <KunButton variant="bordered">info</KunButton>
  </KunBadge>
</template>
```

### Standalone.vue

```vue
<template>
  <!-- 不提供默认插槽时，徽标独立内联渲染（不绝对定位）。 -->
  <span class="inline-flex items-center gap-2">
    未读
    <KunBadge :count="3" color="danger" aria-label="3 条未读" />
  </span>
  <span class="inline-flex items-center gap-2">
    在线
    <KunBadge variant="dot" color="success" aria-label="在线" />
  </span>
  <span class="inline-flex items-center gap-2">
    通知
    <KunBadge :count="120" :max="99" color="primary" aria-label="120 条通知" />
  </span>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | — |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"danger"` |
| `count` | `number` | `0` |
| `max` | `number` | `99` |
| `placement` | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left"` | `"top-right"` |
| `show` | `boolean` | `true` |
| `showZero` | `boolean` | `false` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `variant` | `"count" \| "dot"` | `"count"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/badge
