# NavItem (导航项)

> 应用外壳里的一个导航目的地:一个铺满宽度的 KunButton,当前页为 flat 并带 aria-current="page";stacked 时图标在上、文字在下,用于侧轨或底栏。

## 示例

### Rail.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { key: 'home', label: '首页', icon: 'lucide:home' },
  { key: 'community', label: '社区', icon: 'lucide:messages-square' },
  { key: 'calendar', label: '发售月历', icon: 'lucide:calendar' },
  { key: 'settings', label: '设置', icon: 'lucide:settings' },
]
const current = ref('home')
</script>

<template>
  <nav class="flex w-24 flex-col gap-1">
    <KunNavItem
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :icon="item.icon"
      :current="current === item.key"
      stacked
      @click="current = item.key"
    />
  </nav>
</template>
```

### Sidebar.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { key: 'home', label: '首页', icon: 'lucide:home' },
  { key: 'community', label: '社区', icon: 'lucide:messages-square' },
  { key: 'calendar', label: '发售月历', icon: 'lucide:calendar' },
  { key: 'settings', label: '设置', icon: 'lucide:settings' },
]
const current = ref('community')
</script>

<template>
  <nav class="flex w-56 flex-col gap-1">
    <KunNavItem
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :icon="item.icon"
      :current="current === item.key"
      @click="current = item.key"
    />
    <KunNavItem label="题库" icon="lucide:book-open" disabled />
  </nav>
</template>
```

### Badge.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref('home')
const unread = ref(3)

const open = (key: string) => {
  current.value = key
  if (key === 'messages') unread.value = 0
}
</script>

<template>
  <nav
    class="bg-content1 border-kun grid w-full max-w-sm grid-cols-4 gap-1 rounded-lg border p-1"
  >
    <KunNavItem
      label="首页"
      icon="lucide:home"
      :current="current === 'home'"
      stacked
      @click="open('home')"
    />
    <KunNavItem
      label="社区"
      icon="lucide:messages-square"
      :current="current === 'community'"
      stacked
      @click="open('community')"
    />
    <KunNavItem
      label="消息"
      :current="current === 'messages'"
      stacked
      @click="open('messages')"
    >
      <template #icon>
        <KunBadge :count="unread" size="sm">
          <KunIcon name="lucide:send" class-name="size-5" />
        </KunBadge>
      </template>
    </KunNavItem>
    <KunNavItem
      label="设置"
      icon="lucide:settings"
      :current="current === 'settings'"
      stacked
      @click="open('settings')"
    />
  </nav>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` * | `string` | — | The destination's name, shown under or beside the icon. |
| `className` | `string` | `""` | Extra classes for the underlying KunButton, merged last so yours win. |
| `color` | `KunUIColor` | `"primary"` | Colour of the current item. Every other item stays neutral. |
| `current` | `boolean` | `false` | Marks the page the user is on: the item turns `flat` in `color`, and says so to assistive technology with `aria-current="page"`. KunUI does not read the route; the app decides which item is current. |
| `disabled` | `boolean` | `false` | Blocks clicks and navigation and dims the item. |
| `href` | `string` | `""` | Where the item goes. It renders as a link, through the configured link component; without it the item is a button and `click` is the action. |
| `icon` | `string` | `""` | Iconify name of the icon, e.g. `lucide:compass`. The `#icon` slot replaces it — wrap the icon in a `KunBadge` there to show an unread count on it. |
| `stacked` | `boolean` | `false` | Icon over label, as a rail or a bottom bar draws a destination. Off, the icon sits beside the label, as a sidebar row draws it. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `click` | `event: MouseEvent` |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#icon` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/navitem
