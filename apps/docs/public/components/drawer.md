# Drawer (抽屉)

> 从任意边缘滑出的抽屉面板,支持尺寸与标题。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open drawer</KunButton>
  <KunDrawer v-model="open" title="Drawer title">
    <p class="text-default-600">
      Slides in from the edge (set <code>placement</code>). Press Esc or click the
      backdrop to close.
    </p>
  </KunDrawer>
</template>
```

### Placement.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunDrawerPlacement } from '@kungal/ui-vue'

const open = ref(false)
const placement = ref<KunDrawerPlacement>('right')
const placements: KunDrawerPlacement[] = ['left', 'right', 'top', 'bottom']

const openWith = (p: KunDrawerPlacement) => {
  placement.value = p
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton
      v-for="p in placements"
      :key="p"
      variant="bordered"
      @click="openWith(p)"
    >
      {{ p }}
    </KunButton>
  </div>

  <KunDrawer
    v-model="open"
    :placement="placement"
    :responsive="false"
    title="方向"
  >
    <p class="text-default-600 text-sm">
      通过 <code>placement</code> 设置滑出方向,可选 left / right / top /
      bottom。当前:{{ placement }}。
    </p>
  </KunDrawer>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunDrawerSize } from '@kungal/ui-vue'

const open = ref(false)
const size = ref<KunDrawerSize>('md')
const sizes: KunDrawerSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const openWith = (s: KunDrawerSize) => {
  size.value = s
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton
      v-for="s in sizes"
      :key="s"
      variant="bordered"
      @click="openWith(s)"
    >
      {{ s }}
    </KunButton>
  </div>

  <KunDrawer v-model="open" :size="size" :responsive="false" title="尺寸">
    <p class="text-default-600 text-sm">
      通过 <code>size</code> 控制面板尺寸(横向抽屉为宽度,纵向抽屉为高度),
      可选 sm / md / lg / xl / full。当前:{{ size }}。
    </p>
  </KunDrawer>
</template>
```

### Title.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">带标题的抽屉</KunButton>

  <KunDrawer v-model="open" title="个人设置">
    <p class="text-default-600 text-sm">
      设置 <code>title</code> 后,抽屉顶部会渲染一个带标题的头部栏,
      并自动关联 <code>aria-labelledby</code> 以提升可访问性。
    </p>
  </KunDrawer>
</template>
```

### NonDismissable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton variant="bordered" @click="open = true">不可关闭</KunButton>

  <KunDrawer v-model="open" title="不可关闭" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        设置 <code>:is-dismissable="false"</code> 后,点击背景和按下 Esc
        都不会关闭;头部的关闭按钮仍然有效。
      </p>
      <KunButton color="danger" @click="open = false">手动关闭</KunButton>
    </div>
  </KunDrawer>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` * | `boolean` | — |  |
| `ariaLabel` | `string` | `""` | Accessible name for a drawer with no visible title. Ignored when `title` is set. With neither, KunUI warns in dev. |
| `className` | `string` | `""` |  |
| `innerClassName` | `string` | `""` |  |
| `isCloseRequestDismissable` | `boolean` | `true` | Whether a platform close request dismisses the drawer — in practice Android's back button and back gesture, which close the drawer instead of leaving the page. Desktop is unaffected: its only close request is Escape, handled separately. Ignored when `isDismissable` is `false`. |
| `isDismissable` | `boolean` | `true` |  |
| `isShowCloseButton` | `boolean` | `true` |  |
| `isSwipeDismissable` | `boolean` | `true` | Whether dragging the drawer downwards dismisses it, and whether the drag handle that advertises the gesture is drawn. Only applies to a drawer sitting on the bottom edge — including a `responsive` one that becomes a bottom sheet below `md` — on a touch-primary pointer, and only while the content is scrolled to the top. Ignored when `isDismissable` is `false`. |
| `placement` | `KunDrawerPlacement` | `"right"` |  |
| `responsive` | `boolean` | `true` |  |
| `rounded` | `KunUIRounded` | — |  |
| `size` | `KunDrawerSize` | `"md"` |  |
| `title` | `string` | `""` | Rendered in the header and wired to `aria-labelledby`. Prefer it over `ariaLabel`. |
| `withContainer` | `boolean` | `true` |  |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `close` | — |
| `update:modelValue` | `value: boolean` |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |
| `#footer` | — |
| `#header` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/drawer
