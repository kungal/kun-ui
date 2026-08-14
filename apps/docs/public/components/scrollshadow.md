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
      <span class="text-default-500 max-w-full truncate px-2 text-xs">{{ r.user }}</span>
    </div>
  </KunScrollShadow>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `"scrollable content"` |  |
| `axis` | `"horizontal" \| "vertical"` | `"horizontal"` |  |
| `className` | `string` | `""` |  |
| `contentClass` | `string` | `""` |  |
| `draggable` | `boolean` | `false` | Click-and-drag with a mouse/pen to scroll the area, like grabbing a strip. A drag past a small threshold suppresses the click so cards inside still work on a normal click; touch is left to native scrolling. Default false. |
| `scrollbar` | `"auto" \| "hide" \| "thin"` | `"hide"` | Scrollbar style. `hide` (default) hides it — the edge shadows are the affordance; `thin` shows a slim, theme-coloured scrollbar (a dependency-free alternative to an overlay-scrollbar library); `auto` shows the platform default. |
| `shadowColor` | `string` | `"var(--color-background)"` |  |
| `shadowSize` | `string` | `"2rem"` |  |
| `wheel` | `boolean \| "contain"` | `false` | When `axis='horizontal'`, let a vertical mouse wheel scroll the content sideways (mouse users otherwise can't reach off-screen content; trackpads and touch already can). `true` releases at either edge so the page scrolls on past (no scroll-trap); `'contain'` keeps the wheel on the strip at the edges so the page doesn't move — but only while the strip is actually scrollable, so it can never freeze the page. Default false. |

---
本页来源 · KunUI · https://ui.kungal.com/components/scrollshadow
