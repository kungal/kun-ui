# SplitPane (分栏)

> 可拖动的两栏布局:宽度以 px 计、可吸附、可用键盘调整,按组件自身宽度折成一栏。

## 示例

### ListDetail.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `v-model:size` updates on every move of the divider; `resize-end` fires
// once per drag or key press — persist that one (a cookie the server reads
// back into `size`, so the SSR HTML already has the width).
const size = ref(360)
const saved = ref<number | null>(null)
const topics = [
  { id: 1, title: '《星空列车与白的旅行》通关感想', author: '鲲', replies: 42 },
  { id: 2, title: '求推荐和《白色相簿 2》气质相近的作品', author: '雪之下小春', replies: 128 },
  { id: 3, title: '2026 年秋季新作发售表（持续更新）', author: '坂上智代', replies: 67 },
  { id: 4, title: '汉化补丁 1.2 更新说明', author: '鲲', replies: 15 },
]
const current = ref(topics[0]!)
</script>

<template>
  <div class="w-full space-y-2">
    <div class="border-default-200 rounded-kun-lg h-80 w-full overflow-hidden border">
      <KunSplitPane v-model:size="size" :snap-points="[360, 412]" @resize-end="(s) => (saved = s)">
        <template #start>
          <ul class="bg-content1 h-full overflow-y-auto p-1.5">
            <li v-for="t in topics" :key="t.id">
              <button
                type="button"
                class="rounded-kun-md hover:bg-default/20 w-full px-3 py-2 text-left"
                :class="current.id === t.id && 'bg-primary/10'"
                @click="current = t"
              >
                <span class="block truncate text-sm font-medium">{{ t.title }}</span>
                <span class="text-foreground-muted text-xs">{{ t.author }} · {{ t.replies }} 回复</span>
              </button>
            </li>
          </ul>
        </template>
        <template #end>
          <article class="h-full overflow-y-auto p-5">
            <h3 class="text-lg font-semibold">{{ current.title }}</h3>
            <p class="text-foreground-muted mt-1 text-xs">{{ current.author }} · {{ current.replies }} 回复</p>
            <p class="text-default-700 mt-3 text-sm leading-6">
              拖动中间的分隔线调整左栏宽度，靠近 360 或 412 时会吸附过去，离开 8px 以上就能停在任意宽度。聚焦分隔线后可以用
              <KunKbd keys="ArrowLeft" /> <KunKbd keys="ArrowRight" /> 微调，按住 <KunKbd keys="Shift" /> 一次走五步，
              <KunKbd keys="Home" /> / <KunKbd keys="End" /> 直接到最窄 / 最宽。
            </p>
          </article>
        </template>
      </KunSplitPane>
    </div>
    <p class="text-foreground-muted text-xs">当前 {{ size }}px · 上次保存 {{ saved ?? '—' }}</p>
  </div>
</template>
```

### Aside.vue

```vue
<template>
  <!-- primary="end": the width belongs to the right column; the main area takes
       the rest. A plain :size (no v-model) is just the starting width. -->
  <div class="border-default-200 rounded-kun-lg h-72 w-full overflow-hidden border">
    <KunSplitPane primary="end" :size="280" :min-size="220" :max-size="360">
      <template #start>
        <article class="h-full overflow-y-auto p-5">
          <h3 class="text-lg font-semibold">千恋＊万花</h3>
          <p class="text-default-700 mt-3 text-sm leading-6">
            穗织是一座被山环绕的温泉小镇。主角有地将臣在帮忙整理神社时，意外拔出了供奉在那里的神刀「丛雨丸」，
            从此被卷入与神刀之灵、巫女和小镇诅咒相关的一连串事件。
          </p>
        </article>
      </template>
      <template #end>
        <aside class="bg-content1 h-full space-y-3 overflow-y-auto p-4">
          <h4 class="text-sm font-semibold">标签</h4>
          <div class="flex flex-wrap gap-1.5">
            <KunChip size="sm" variant="flat">纯爱</KunChip>
            <KunChip size="sm" variant="flat">和风</KunChip>
            <KunChip size="sm" variant="flat">神社</KunChip>
            <KunChip size="sm" variant="flat">温泉</KunChip>
          </div>
          <h4 class="text-sm font-semibold">同社作品</h4>
          <ul class="text-default-700 space-y-1 text-sm">
            <li>天使☆騒々 RE-BOOT!</li>
            <li>喫茶ステラと死神の蝶</li>
            <li>サノバウィッチ</li>
          </ul>
        </aside>
      </template>
    </KunSplitPane>
  </div>
</template>
```

### Stacked.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Stacking follows the component's OWN width (a container query), not the
// window: this box is narrower than 48rem, so it shows one pane at a time on
// any screen, and `show-pane` chooses which.
const pane = ref<'start' | 'end'>('start')
</script>

<template>
  <div class="w-full max-w-sm space-y-2">
    <div class="flex gap-2">
      <KunButton size="sm" :variant="pane === 'start' ? 'solid' : 'bordered'" @click="pane = 'start'">列表</KunButton>
      <KunButton size="sm" :variant="pane === 'end' ? 'solid' : 'bordered'" @click="pane = 'end'">详情</KunButton>
    </div>
    <div class="border-default-200 rounded-kun-lg h-48 overflow-hidden border">
      <KunSplitPane :show-pane="pane">
        <template #start>
          <ul class="bg-content1 h-full space-y-1 p-3 text-sm">
            <li>《星空列车与白的旅行》通关感想</li>
            <li>求推荐和《白色相簿 2》气质相近的作品</li>
            <li>2026 年秋季新作发售表</li>
          </ul>
        </template>
        <template #end>
          <p class="text-default-700 p-3 text-sm">窄于 48rem 时只显示一栏，分隔线也会隐藏。</p>
        </template>
      </KunSplitPane>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `locale splitPane.handle` | Accessible name of the divider. |
| `maxSize` | `number` | `480` | Widest the primary pane can be dragged, in px. |
| `minSize` | `number` | `240` | Narrowest the primary pane can be dragged, in px. |
| `primary` | `"start" \| "end"` | `"start"` | Which pane `size` belongs to; the other takes the rest. `end` suits a main area with an auxiliary column on the right. |
| `showPane` | `"start" \| "end"` | `"start"` | Which pane shows while stacked. |
| `size` | `number` | `360` | Width of the primary pane in px. Updated on every pointer move while dragging; persist from `resize-end`. |
| `snapPoints` | `number[]` | `[]` | Widths the divider is pulled to when it comes within `snapThreshold`, e.g. `[360, 412]`. Any width in between stays reachable. |
| `snapThreshold` | `number` | `8` | How close, in px, the divider must come to a snap point to be pulled to it. |
| `stackBelow` | `false \| "md" \| "lg"` | `"md"` | Below this width of the component ITSELF (a container query, not the window), show one pane at a time: `md` is 48rem, `lg` 64rem. `false` keeps two panes at any width. |
| `step` | `number` | `10` | Arrow-key step in px; Shift moves five steps. |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `resize-end` | `size: number` | A drag or a key press finished with this width — the one to persist. |
| `update:size` | `value: number` |  |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#end` | `any` | The right pane. |
| `#start` | `any` | The left pane. |

---
本页来源 · KunUI · https://ui.kungal.com/components/splitpane
