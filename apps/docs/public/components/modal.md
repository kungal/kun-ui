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
  <KunModal
    v-model="open"
    title="Hello from a modal"
    description="Teleported to body, focus-trapped, body-scroll-locked. Press Esc or click the backdrop to close."
  >
    <p class="text-default-600 text-sm">
      <code>title</code> 渲染为面板的 <code>&lt;h2&gt;</code> 并关联
      <code>aria-labelledby</code>,<code>description</code> 关联
      <code>aria-describedby</code> — 屏幕阅读器念到的名字就是屏幕上看到的那个。
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

  <KunModal
    v-model="open"
    :size="size"
    :title="`尺寸:${size}`"
    description="通过 size 控制面板的最大宽度,可选 sm / md / lg / xl / full。"
  >
    <KunButton color="primary" @click="open = false">关闭</KunButton>
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

  <KunModal v-model="auto" title="自适应对齐">
    <div class="flex flex-col gap-3">
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

  <KunModal v-model="top" placement="top" title="顶部对齐">
    <div class="flex flex-col gap-3">
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

  <KunModal v-model="open" scroll-behavior="outside" title="滚动行为:outside">
    <div class="flex flex-col gap-3">
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

  <KunModal v-model="openLocked" :is-dismissable="false" title="不可关闭背景">
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        设置 <code>:is-dismissable="false"</code> 后,点击背景和按下 Esc
        都不会关闭,只能通过按钮主动关闭。
      </p>
      <KunButton color="danger" @click="openLocked = false">关闭</KunButton>
    </div>
  </KunModal>

  <KunModal
    v-model="openNoClose"
    :is-show-close-button="false"
    title="隐藏关闭按钮"
  >
    <div class="flex flex-col gap-3">
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

  <KunModal
    v-model="open"
    role="alertdialog"
    title="确认删除?"
    description="此操作不可撤销,账户下的全部数据都会被移除。"
  >
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        <code>role="alertdialog"</code> 把对话框标记为警告语义,用于需要用户明确
        回答的破坏性操作。它同时让点击背景不再关闭对话框 — 落在遮罩上的一次点击
        不算一个回答;Esc 仍然可以取消,和 Radix / Reka 的 AlertDialog 一致。
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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` * | `boolean` | — |  |
| `ariaLabel` | `string` | `""` | Accessible name for a dialog that draws its own heading inside the slot instead of passing `title`. Ignored when `title` is set (that wins, via `aria-labelledby`). With neither, KunUI warns in dev. |
| `className` | `string` | `""` |  |
| `description` | `string` | `""` | Rendered under the title and wired to `aria-describedby` — the supporting line a `role="alertdialog"` is required to point at. |
| `innerClassName` | `string` | `""` |  |
| `isCloseRequestDismissable` | `boolean` | `true` | Whether a platform close request dismisses the dialog — in practice Android's back button and back gesture, which close the dialog instead of leaving the page (the behaviour a native `<dialog>` already has). Desktop is unaffected: its only close request is Escape, handled separately. Turn this off for a dialog that is bound to a route and should let back navigate. Ignored when `isDismissable` is `false`. |
| `isDismissable` | `boolean` | `true (backdrop excluded when role="alertdialog")` | Whether a backdrop click or Escape closes the dialog. `role="alertdialog"` stops the BACKDROP from dismissing (a click that lands on the dim area is not an answer) while Escape still cancels, matching Radix and Reka. Pass `true` to opt the backdrop back in, `false` to turn both off. |
| `isShowCloseButton` | `boolean` | `true` |  |
| `isSwipeDismissable` | `boolean` | `true` | Whether dragging the phone sheet downwards dismisses it, and whether the drag handle that advertises the gesture is drawn. Only applies where the sheet exists — `placement="auto"` below `md`, on a touch-primary pointer — and only while the content is scrolled to the top, so a swipe over scrollable content still scrolls it. Follows `isDismissable`, so a `role="alertdialog"` cannot be swiped away any more than it can be clicked away. |
| `placement` | `KunModalPlacement` | `"auto"` | Vertical alignment of the panel. Default 'auto' — a bottom sheet on phones, a centred dialog from `md` up. Pass 'center' for the pre-2.19 behaviour of centring at every width. |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` | ARIA role of the panel. Use 'alertdialog' for confirm/destructive prompts that need an immediate response — it also flips the isDismissable default. Default 'dialog'. |
| `rounded` | `KunUIRounded` | — |  |
| `scrollBehavior` | `"inside" \| "outside"` | `"inside"` | inside (default): the panel body scrolls, capped at 90dvh — 85dvh for an `auto` sheet below `md`, which needs a wider tap-to-dismiss strip above it — and never taller than the visible viewport, so the on-screen keyboard can't bury it. outside: the whole overlay scrolls — for panels taller than the viewport. |
| `size` | `KunModalSize` | `"md"` | Max width of the panel (full = nearly the whole viewport). Default 'md'. |
| `title` | `string` | `""` | Rendered as the panel's `<h2>` and wired to `aria-labelledby`, so the name a screen reader announces is the one on screen. Prefer it over `ariaLabel`. |
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

---
本页来源 · KunUI · https://ui.kungal.com/components/modal
