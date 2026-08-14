# Carousel (轮播)

> 横向轮播(KunCarousel + KunCarouselItem):原生滚动吸附 + 触摸滑动,箭头/圆点/自动播放为渐进增强。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
const slides = [
  { from: 'from-primary', to: 'to-secondary', label: 'CG 1' },
  { from: 'from-success', to: 'to-info', label: 'CG 2' },
  { from: 'from-warning', to: 'to-danger', label: 'CG 3' },
  { from: 'from-secondary', to: 'to-primary', label: 'CG 4' },
]
</script>

<template>
  <KunCarousel class-name="w-full max-w-md">
    <KunCarouselItem v-for="s in slides" :key="s.label">
      <div
        :class="`flex h-48 items-center justify-center rounded-kun-lg bg-gradient-to-br ${s.from} ${s.to} text-2xl font-bold text-white`"
      >
        {{ s.label }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
```

### MultiView.vue

```vue
<script setup lang="ts">
const items = Array.from({ length: 8 }, (_, i) => i + 1)
</script>

<template>
  <KunCarousel :slides-per-view="3" gap="0.75rem" class-name="w-full max-w-lg">
    <KunCarouselItem v-for="n in items" :key="n">
      <div class="rounded-kun-lg bg-content2 flex h-28 items-center justify-center text-lg font-semibold">
        {{ n }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
```

### Autoplay.vue

```vue
<script setup lang="ts">
const slides = ['公告一', '公告二', '公告三']
</script>

<template>
  <KunCarousel :autoplay="2500" class-name="w-full max-w-md">
    <KunCarouselItem v-for="(s, i) in slides" :key="i">
      <div class="rounded-kun-lg bg-primary/10 text-primary flex h-32 items-center justify-center text-xl font-bold">
        {{ s }}
      </div>
    </KunCarouselItem>
  </KunCarousel>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `"轮播"` |  |
| `autoplay` | `number` | `0` | Autoplay interval in ms (0 = off). Pauses on hover/focus, off under reduced-motion. |
| `className` | `string` | `""` |  |
| `gap` | `string` | `"1rem"` | Gap between slides (any CSS length). |
| `loop` | `boolean` | `true` | Seamless infinite loop via slide repositioning (CSS `order`), no cloned DOM. Autoplay glides past the last slide into the first instead of snapping back. Default `true`; auto-disabled when there are too few slides to loop cleanly. |
| `showArrows` | `boolean` | `true` |  |
| `showIndicators` | `boolean` | `true` |  |
| `slidesPerView` | `number` | `1` | Slides visible at once (>1 for thumbnail strips). |

---
本页来源 · KunUI · https://ui.kungal.com/components/carousel
