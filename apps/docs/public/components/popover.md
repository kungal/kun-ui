# Popover (气泡卡片)

> 锚定在触发槽上的浮层面板。

## 示例

### Basic.vue

```vue
<template>
  <KunPopover>
    <template #trigger>
      <KunButton variant="bordered">点击打开</KunButton>
    </template>
    <div class="p-3 text-sm">
      <p class="font-medium">弹出框内容</p>
      <p class="text-default-600 mt-1">点击触发器打开，点击外部或按 Esc 关闭。</p>
    </div>
  </KunPopover>
</template>
```

### Placements.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunPopover position="top">
      <template #trigger>
        <KunButton variant="bordered">上 top</KunButton>
      </template>
      <div class="p-3 text-sm">出现在上方</div>
    </KunPopover>
    <KunPopover position="right">
      <template #trigger>
        <KunButton variant="bordered">右 right</KunButton>
      </template>
      <div class="p-3 text-sm">出现在右侧</div>
    </KunPopover>
    <KunPopover position="bottom">
      <template #trigger>
        <KunButton variant="bordered">下 bottom</KunButton>
      </template>
      <div class="p-3 text-sm">出现在下方</div>
    </KunPopover>
    <KunPopover position="left">
      <template #trigger>
        <KunButton variant="bordered">左 left</KunButton>
      </template>
      <div class="p-3 text-sm">出现在左侧</div>
    </KunPopover>
  </div>
</template>
```

### Arrow.vue

```vue
<template>
  <KunPopover position="bottom" :show-arrow="true">
    <template #trigger>
      <KunButton variant="bordered">点击查看箭头</KunButton>
    </template>
    <div class="p-3 text-sm">
      <p class="font-medium">带箭头的弹出框</p>
      <p class="text-default-600 mt-1">箭头指向触发器。</p>
    </div>
  </KunPopover>
</template>
```

### RichContent.vue

```vue
<template>
  <KunPopover position="bottom-start" :show-arrow="true">
    <template #trigger>
      <KunButton color="primary">打开卡片</KunButton>
    </template>
    <div class="flex w-64 flex-col gap-3 p-4">
      <div class="flex items-center gap-3">
        <div
          class="bg-primary flex size-10 items-center justify-center rounded-full font-semibold text-white"
        >
          K
        </div>
        <div>
          <p class="font-semibold">KunUI</p>
          <p class="text-default-600 text-sm">@kungalgame</p>
        </div>
      </div>
      <p class="text-default-600 text-sm">
        打开时焦点会移入面板，关闭时会返回到触发器。
      </p>
      <div class="flex justify-end gap-2">
        <KunButton size="sm" variant="bordered">取消</KunButton>
        <KunButton size="sm" color="primary">关注</KunButton>
      </div>
    </div>
  </KunPopover>
</template>
```

### HoverMenu.vue

```vue
<script setup lang="ts">
// 导航悬停菜单:一排 KunPopover，trigger="hover" + 共享 group。
// 悬停打开;横向移到兄弟项瞬间切换(跳过 openDelay);下移到面板时靠坐标安全三角
// 不会中途关闭;点链接跳转;键盘/Esc 仍可用;触屏自动退回点击。
const menus = [
  { label: '产品', items: ['可视小说引擎', 'Galgame 资源', 'CG 画廊'] },
  { label: '社区', items: ['论坛', '评测', '同人活动'] },
  { label: '资源', items: ['下载中心', '补丁站', 'API 文档'] },
]
</script>

<template>
  <nav class="flex items-center gap-1">
    <KunPopover
      v-for="m in menus"
      :key="m.label"
      trigger="hover"
      group="docs-nav"
      position="bottom-start"
      inner-class="p-1"
      opaque
    >
      <template #trigger>
        <button
          class="rounded-kun-md hover:bg-default-100 px-3 py-2 text-sm font-medium transition-colors"
        >
          {{ m.label }}
        </button>
      </template>

      <div class="flex w-44 flex-col">
        <KunLink
          v-for="it in m.items"
          :key="it"
          to="#"
          color="default"
          underline="none"
          class-name="rounded-kun-md hover:bg-default-100 px-3 py-2 text-sm"
        >
          {{ it }}
        </KunLink>
      </div>
    </KunPopover>
  </nav>
</template>
```

### RailFlyout.vue

```vue
<script setup lang="ts">
// 侧边导航栏的右向悬停飞出菜单。position="right-start" 让菜单贴着 tile 顶部向右展开;
// autoPosition(默认)带来碰撞感知:靠近视口底部的高菜单会由 shift() 上移、size() 把
// 高度限制到可用空间并自动滚动,而不是冲出屏幕底部被裁掉。
// —— 这正是过去只能手写 `absolute left-full + max-h-[80vh]` 的场景,现在交给 KunPopover。
const groups = [
  { icon: 'lucide:home', label: '首页', items: ['仪表盘', '动态', '收藏'] },
  {
    icon: 'lucide:folder',
    label: '项目',
    items: Array.from({ length: 16 }, (_, i) => `项目 ${i + 1}`),
  },
  {
    icon: 'lucide:settings',
    label: '设置',
    items: ['个人资料', '账户', '外观', '通知', '安全', '账单'],
  },
]
</script>

<template>
  <div class="inline-flex flex-col gap-2 rounded-kun-lg border-kun border p-2">
    <KunPopover
      v-for="g in groups"
      :key="g.label"
      position="right-start"
      trigger="hover"
      group="rail"
      :aria-label="g.label"
      opaque
    >
      <template #trigger>
        <button
          class="hover:bg-default-100 flex size-10 items-center justify-center rounded-kun-md transition-colors"
          :aria-label="g.label"
        >
          <KunIcon :name="g.icon" class="size-5" />
        </button>
      </template>

      <div class="w-48 p-1">
        <p class="text-default-500 px-2 py-1 text-xs font-medium">{{ g.label }}</p>
        <button
          v-for="it in g.items"
          :key="it"
          class="hover:bg-default-100 block w-full rounded-kun-sm px-2 py-1.5 text-left text-sm"
        >
          {{ it }}
        </button>
      </div>
    </KunPopover>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Accessible name for the dialog (role="dialog" needs a name). |
| `autoPosition` | `boolean` | `true` | Avoid viewport collisions: flip to the opposite side, shift along the edge, and cap height/width to the available space so tall content scrolls instead of overflowing. Default `true`. Set `false` to honour `position` verbatim. |
| `closeDelay` | `number` | `120` | `trigger="hover"`: ms grace after leaving (crosses the gap). Default 120. |
| `fullWidth` | `boolean` | `false` | Make the trigger anchor span its container instead of shrinking to its content. Both wrapper divs switch from `inline-block` to `block w-full`, so a full-width trigger (e.g. a `fullWidth` KunButton or a split button) can actually fill the width. Default `false` (inline, content-width). |
| `group` | `string` | — | `trigger="hover"`: shared id so a row of menus switches instantly between siblings and only one is open at a time (menu-bar behaviour). |
| `innerClass` | `string` | `""` |  |
| `opaque` | `boolean` | `false` | Force a fully OPAQUE panel, ignoring a globally-lowered `--kun-surface-opacity` (which sites with a background image use to frost surfaces). Menus/popovers over a busy background usually want this for legibility. Default `false` (follows the global surface opacity). Note: setting `--kun-surface-opacity:1` on the panel yourself does NOT work — Tailwind resolves the themed colour at `:root`. |
| `openDelay` | `number` | `100` | `trigger="hover"`: ms before a hover opens. Default 100. |
| `position` | `KunPopoverPosition` | `"bottom-start"` |  |
| `rounded` | `KunUIRounded` | — |  |
| `showArrow` | `boolean` | `false` | Render a caret pointing at the trigger. |
| `trigger` | `"click" \| "hover"` | `"click"` | How the popover opens. `'click'` (default) toggles + moves focus into the panel. `'hover'` opens on mouse hover with a coordinate safe-triangle so you can reach the panel without it closing — for navigation menus. Hover never steals focus; click/keyboard/Esc still work, and touch falls back to click. |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |
| `#trigger` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/popover
