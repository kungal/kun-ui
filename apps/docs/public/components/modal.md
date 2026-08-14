# Modal (对话框)

> 传送到 body 的对话框,焦点锁定、滚动锁定,可按 Esc 关闭。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open modal</KunButton>
  <KunModal v-model="open">
    <h3 class="text-lg font-semibold">Hello from a modal</h3>
    <p class="text-default-600 mt-1">
      Teleported to body, focus-trapped, body-scroll-locked. Press Esc or click
      the backdrop to close.
    </p>
  </KunModal>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { KunModalSize } from '@kungal/ui-vue'

const open = ref(false)
const size = ref<KunModalSize>('md')
const sizes: KunModalSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const openWith = (s: KunModalSize) => {
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

  <KunModal v-model="open" :size="size">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">尺寸:{{ size }}</h3>
      <p class="text-default-600 text-sm">
        通过 <code>size</code> 控制面板的最大宽度,可选 sm / md / lg / xl /
        full。
      </p>
      <KunButton color="primary" @click="open = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
```

### Placement.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const auto = ref(false)
const top = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton color="primary" @click="auto = true">自适应(默认)</KunButton>
    <KunButton variant="bordered" @click="top = true">顶部对齐</KunButton>
  </div>

  <KunModal v-model="auto">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">自适应对齐</h3>
      <p class="text-default-600 text-sm">
        默认值 <code>placement="auto"</code>:窄屏(<code>md</code> 以下)从底部
        升起、贴边铺满,更贴近手机的操作习惯;<code>md</code> 及以上恢复居中。
        把浏览器窗口拉窄再打开一次就能看到差别。
      </p>
      <p class="text-default-600 text-sm">
        需要在所有宽度都居中,传 <code>placement="center"</code>。
      </p>
      <KunButton color="primary" @click="auto = false">关闭</KunButton>
    </div>
  </KunModal>

  <KunModal v-model="top" placement="top">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">顶部对齐</h3>
      <p class="text-default-600 text-sm">
        <code>placement="top"</code> 在所有宽度下都贴近视口顶部。
      </p>
      <KunButton color="primary" @click="top = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
```

### ScrollBehavior.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const paragraphs = Array.from({ length: 12 }, (_, i) => i + 1)
</script>

<template>
  <KunButton color="primary" @click="open = true">外部滚动</KunButton>

  <KunModal v-model="open" scroll-behavior="outside">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">滚动行为:outside</h3>
      <p class="text-default-600 text-sm">
        当内容超出视口时,<code>scrollBehavior="outside"</code>
        让整个遮罩层滚动;默认的 <code>inside</code> 则只滚动面板内部。
      </p>
      <p
        v-for="n in paragraphs"
        :key="n"
        class="text-default-600 text-sm"
      >
        第 {{ n }} 段内容,用于撑高对话框以演示滚动效果。
      </p>
      <KunButton color="primary" @click="open = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
```

### NonDismissable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const openLocked = ref(false)
const openNoClose = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton variant="bordered" @click="openLocked = true">
      不可关闭背景
    </KunButton>
    <KunButton variant="bordered" @click="openNoClose = true">
      隐藏关闭按钮
    </KunButton>
  </div>

  <KunModal v-model="openLocked" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">不可关闭背景</h3>
      <p class="text-default-600 text-sm">
        设置 <code>:is-dismissable="false"</code> 后,点击背景和按下 Esc
        都不会关闭,只能通过按钮主动关闭。
      </p>
      <KunButton color="danger" @click="openLocked = false">关闭</KunButton>
    </div>
  </KunModal>

  <KunModal v-model="openNoClose" :is-show-close-button="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">隐藏关闭按钮</h3>
      <p class="text-default-600 text-sm">
        设置 <code>:is-show-close-button="false"</code> 隐藏右上角的关闭按钮,
        仍可点击背景或按 Esc 关闭。
      </p>
      <KunButton color="primary" @click="openNoClose = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
```

### AlertDialog.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="danger" @click="open = true">删除账户</KunButton>

  <KunModal v-model="open" role="alertdialog" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">确认删除?</h3>
      <p class="text-default-600 text-sm">
        设置 <code>role="alertdialog"</code> 将对话框标记为警告语义,
        适用于需要用户明确确认的破坏性操作。此例同时关闭了背景关闭。
      </p>
      <div class="flex justify-end gap-2">
        <KunButton variant="bordered" @click="open = false">取消</KunButton>
        <KunButton color="danger" @click="open = false">确认删除</KunButton>
      </div>
    </div>
  </KunModal>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `modelValue` * | `boolean` | — |
| `ariaLabel` | `string` | — |
| `className` | `string` | `""` |
| `innerClassName` | `string` | `""` |
| `isDismissable` | `boolean` | `true` |
| `isShowCloseButton` | `boolean` | `true` |
| `placement` | `KunModalPlacement` | `"auto"` |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `scrollBehavior` | `"inside" \| "outside"` | `"inside"` |
| `size` | `KunModalSize` | `"md"` |
| `withContainer` | `boolean` | `true` |

---
本页来源 · KunUI · https://ui.kungal.com/components/modal
