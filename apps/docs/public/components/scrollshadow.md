# ScrollShadow (滚动阴影)

> 带边缘渐隐阴影的滚动容器,仅在有更多内容时出现;横向条可选鼠标滚轮横向滚动、按住拖拽滚动,到两端自动交还页面滚动。

## 示例

### Basic.vue

```vue
<template>
  <KunScrollShadow class-name="max-w-md" aria-label="标签列表">
    <KunChip v-for="n in 16" :key="n" color="primary" class-name="shrink-0">
      标签 {{ n }}
    </KunChip>
  </KunScrollShadow>
</template>
```

### Vertical.vue

```vue
<template>
  <KunScrollShadow
    axis="vertical"
    class-name="h-48 max-w-md"
    aria-label="可滚动的卡片列表"
  >
    <KunCard v-for="n in 10" :key="n" color="default" class-name="shrink-0">
      第 {{ n }} 行内容
    </KunCard>
  </KunScrollShadow>
</template>
```

### Interactive.vue

```vue
<script setup lang="ts">
// 横向评分条:wheel 让鼠标滚轮左右滚,draggable 允许按住拖动。这里用 wheel="contain"
// ——滚到最前/最后把滚轮留在条上、页面不向下滚(仅在条可滚时生效,不会卡死页面);
// 想让它到边界交还页面滚动,改成 wheel 即可。触摸设备仍用原生滑动。
const ratings = [
  { user: '空想科学', score: 9.2 },
  { user: '月色真美', score: 8.7 },
  { user: '雨声', score: 9.5 },
  { user: '夏目', score: 8.1 },
  { user: '星之卡比', score: 7.9 },
  { user: '银河铁道', score: 9.0 },
  { user: '紫罗兰', score: 9.8 },
  { user: '凉宫', score: 8.4 },
  { user: '秒速五厘米', score: 8.8 },
  { user: '言叶之庭', score: 9.1 },
  { user: '你的名字', score: 9.6 },
  { user: '天气之子', score: 8.5 },
]
</script>

<template>
  <KunScrollShadow axis="horizontal" wheel="contain" draggable scrollbar="thin" class-name="max-w-md" aria-label="用户评分">
    <div
      v-for="r in ratings"
      :key="r.user"
      class="border-default-200 bg-content1 rounded-kun-lg flex h-24 w-28 shrink-0 flex-col items-center justify-center gap-1 border shadow-sm select-none"
    >
      <span class="text-primary text-2xl font-bold tabular-nums">{{ r.score.toFixed(1) }}</span>
      <span class="text-foreground-muted max-w-full truncate px-2 text-xs">{{ r.user }}</span>
    </div>
  </KunScrollShadow>
</template>
```

### Buttons.vue

```vue
<script setup lang="ts">
// 窄屏上的编辑器工具栏:只有边缘阴影时用户常常意识不到右边还有按钮。
// scroll-buttons 在可滚动的一侧浮出与 KunTab 相同的箭头,点击翻过约 80% 的宽度;
// 与 draggable 同用时拖动不会误触箭头。
const actions = [
  { icon: 'lucide:quote', label: '引用' },
  { icon: 'lucide:at-sign', label: '提及' },
  { icon: 'lucide:image', label: '插入图片' },
  { icon: 'lucide:paperclip', label: '附件' },
  { icon: 'lucide:smile-plus', label: '表情' },
  { icon: 'lucide:pencil', label: '编辑' },
  { icon: 'lucide:copy', label: '复制' },
  { icon: 'lucide:pin', label: '置顶' },
  { icon: 'lucide:eye', label: '预览' },
  { icon: 'lucide:upload', label: '上传' },
  { icon: 'lucide:download', label: '下载' },
  { icon: 'lucide:external-link', label: '新窗口打开' },
  { icon: 'lucide:flag', label: '举报' },
  { icon: 'lucide:trash-2', label: '删除' },
]
</script>

<template>
  <div class="border-default-200 bg-content1 rounded-kun-lg max-w-xs border p-1">
    <KunScrollShadow
      axis="horizontal"
      scroll-buttons
      wheel
      draggable
      content-class="gap-1"
      aria-label="编辑器工具栏"
    >
      <KunButton
        v-for="a in actions"
        :key="a.icon"
        variant="light"
        size="sm"
        is-icon-only
        :aria-label="a.label"
      >
        <KunIcon :name="a.icon" />
      </KunButton>
    </KunScrollShadow>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `"scrollable content"` | Accessible name for the scrollable region. Default 'scrollable content'. |
| `axis` | `"horizontal" \| "vertical"` | `"horizontal"` |  |
| `className` | `string` | `""` |  |
| `contentClass` | `string` | `""` |  |
| `draggable` | `boolean` | `false` | Click-and-drag with a mouse/pen to scroll the area, like grabbing a strip. A drag past a small threshold suppresses the click so cards inside still work on a normal click; touch is left to native scrolling. Default false. |
| `scrollbar` | `"auto" \| "hide" \| "thin"` | `"hide"` | Scrollbar style. `hide` (default) hides it — the edge shadows are the affordance; `thin` shows a slim, theme-coloured scrollbar (a dependency-free alternative to an overlay-scrollbar library); `auto` shows the platform default. |
| `scrollButtons` | `boolean` | `false` | When `axis='horizontal'`, float a chevron button on each edge that can still scroll — the same control KunTab shows on an overflowing strip. A click scrolls ~80% of the viewport. Use it where the edge shadow alone doesn't tell users the strip scrolls (narrow screens, toolbars). Ignored for `axis='vertical'`. Default false. |
| `shadowColor` | `string` | `"var(--color-background)"` |  |
| `shadowSize` | `string` | `"2rem"` |  |
| `wheel` | `boolean \| "contain"` | `false` | When `axis='horizontal'`, let a vertical mouse wheel scroll the content sideways (mouse users otherwise can't reach off-screen content; trackpads and touch already can). `true` releases at either edge so the page scrolls on past (no scroll-trap); `'contain'` keeps the wheel on the strip at the edges so the page doesn't move — but only while the strip is actually scrollable, so it can never freeze the page. Default false. |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/scrollshadow
