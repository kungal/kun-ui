# Image (图片)

> 带骨架屏、宽高比与 object-fit 的图片;在 Nuxt 层下经由 @nuxt/image 渲染。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// Offline-safe inline SVG data URI so the demo renders with no network.
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- provider="none" → a plain <img> with no @nuxt/image optimization. -->
  <KunImage
    :src="img"
    alt="示例图片"
    provider="none"
    :width="240"
    :height="180"
    class-name="rounded-kun-lg"
  />
</template>
```

### AspectRatio.vue

```vue
<script setup lang="ts">
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- aspectRatio 让图片在加载前就占据固定比例的空间，避免布局抖动。 -->
  <div class="flex flex-wrap items-start gap-4">
    <KunImage
      :src="img"
      alt="16:9"
      provider="none"
      aspect-ratio="16 / 9"
      class-name="w-56 rounded-kun-lg"
    />
    <KunImage
      :src="img"
      alt="1:1"
      provider="none"
      aspect-ratio="1 / 1"
      class-name="w-40 rounded-kun-lg"
    />
  </div>
</template>
```

### ObjectFit.vue

```vue
<script setup lang="ts">
// A wide image placed into a square box so the difference between
// cover (裁剪填满) and contain (完整缩放) is visible.
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs><rect width="600" height="200" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="cover"
        provider="none"
        object-fit="cover"
        aspect-ratio="1 / 1"
        class-name="w-40 rounded-kun-lg bg-default-100"
      />
      <span class="text-default-500 text-sm">cover</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="contain"
        provider="none"
        object-fit="contain"
        aspect-ratio="1 / 1"
        class-name="w-40 rounded-kun-lg bg-default-100"
      />
      <span class="text-default-500 text-sm">contain</span>
    </div>
  </div>
</template>
```

### Skeleton.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const base = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`

// `skeleton` 默认开启：图片加载完成前显示脉冲骨架占位。
// 点击按钮重新挂载组件以重新触发一次加载过程。
const key = ref(0)
const reload = () => (key.value += 1)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunImage
      :key="key"
      :src="`${base}#${key}`"
      alt="骨架屏示例"
      provider="none"
      aspect-ratio="4 / 3"
      :skeleton="true"
      class-name="w-56 rounded-kun-lg"
    />
  </div>
</template>
```

### BlurUp.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// ThumbHash 是一段 ~25 字节的紧凑哈希,通常由后端随图片元数据一起下发。
// KunImage 在客户端把它解码成一张极小的图,放大成「模糊占位」,真实图片加载完成后淡出。
// (这串 base64 即 banner.webp 的 ThumbHash。)
const thumbhash = 'eBeCA4AmyAaYeIcLy20KVwg3inaCelc='

// 重新挂载以再看一次「模糊 → 清晰」的过程(慢速网络下尤为明显)。
const key = ref(0)
const reload = () => (key.value += 1)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunImage
      :key="key"
      :src="`/banner.webp?${key}`"
      alt="ThumbHash 模糊占位示例"
      provider="none"
      aspect-ratio="16 / 9"
      :thumbhash="thumbhash"
      class-name="w-72 rounded-kun-lg"
    />
  </div>
</template>
```

### Fallback.vue

```vue
<script setup lang="ts">
// 当 src 加载失败时，自动切换到 fallbackSrc。
// 这里故意用一个无法加载的地址触发回退。
const broken = 'https://invalid.kungal.example/not-found.png'
const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23e5e7eb"/><text x="200" y="160" font-size="28" fill="%236b7280" text-anchor="middle">回退图片</text></svg>'
)}`
</script>

<template>
  <KunImage
    :src="broken"
    :fallback-src="fallback"
    alt="加载失败回退"
    provider="none"
    aspect-ratio="4 / 3"
    class-name="w-56 rounded-kun-lg"
  />
</template>
```

### ErrorEvent.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 当"加载失败"意味着整块内容都不该出现时(例如角色立绘、装饰图),
// fallbackSrc 帮不上忙——它只是换一张图,占位盒子还在。
// 这时监听 @error,自己把整块移除。
const broken = 'https://invalid.kungal.example/not-found.png'
const ok = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23c7d2fe"/><text x="200" y="160" font-size="28" fill="%234338ca" text-anchor="middle">正常图片</text></svg>'
)}`

// 事件签名:(src, event?) —— src 是失败的那个地址,
// event 在通过 DOM 事件发现失败时存在;若失败是从缓存中直接判定的(图片
// 早已 complete 且解码失败),则没有对应的 DOM 事件,event 为 undefined。
const gone = ref(false)
const log = ref<string[]>([])
const onError = (src: string, event?: Event) => {
  gone.value = true
  log.value.push(`error: ${src.slice(0, 40)} (${event ? event.type : '无 DOM 事件'})`)
}
const onLoad = (src: string) => log.value.push(`load: ${src.slice(0, 40)}`)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-start gap-4">
      <KunImage
        v-if="!gone"
        :src="broken"
        alt="加载失败即整体消失"
        provider="none"
        aspect-ratio="4 / 3"
        class-name="w-56 rounded-kun-lg"
        @error="onError"
        @load="onLoad"
      />
      <KunImage
        :src="ok"
        alt="正常图片"
        provider="none"
        aspect-ratio="4 / 3"
        class-name="w-56 rounded-kun-lg"
        @error="onError"
        @load="onLoad"
      />
    </div>
    <pre class="text-default-500 text-xs">{{ log.join('\n') || '等待中…' }}</pre>
  </div>
</template>
```

### Loading.vue

```vue
<script setup lang="ts">
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ec4899"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- loading="eager" 用于首屏 / LCP 图片，立即加载；
       loading="lazy"（默认）用于折叠以下的图片，进入视口才加载。 -->
  <div class="flex flex-wrap items-start gap-4">
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="eager"
        provider="none"
        loading="eager"
        fetchpriority="high"
        aspect-ratio="4 / 3"
        class-name="w-44 rounded-kun-lg"
      />
      <span class="text-default-500 text-sm">eager（即时）</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="lazy"
        provider="none"
        loading="lazy"
        aspect-ratio="4 / 3"
        class-name="w-44 rounded-kun-lg"
      />
      <span class="text-default-500 text-sm">lazy（懒加载，默认）</span>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` * | `string` | — | Image URL. Under Nuxt it is handed to the injected `<NuxtImg>`, so a provider path or a remote URL both work. |
| `alt` | `string` | `"image"` | Alternative text. Write the empty string for a decorative image so screen readers skip it. |
| `ariaLabel` | `string` | — | Accessible name, when it has to differ from `alt`. |
| `aspectRatio` | `string` | — | CSS aspect-ratio on the wrapper, e.g. "16 / 9". When set the image is absolutely positioned and fills the box. |
| `className` | `string` | — | Classes for the WRAPPER element (the box that holds the skeleton and the aspect ratio). Extra classes, merged after the component's own classes so yours wins the conflict — KunUI's `rounded-kun-*` / `shadow-kun-*` scales included. |
| `decoding` | `"auto" \| "sync" \| "async"` | — | Native `decoding` hint. `async` keeps a large image from blocking the frame it lands in. |
| `densities` | `string` | — | Pixel densities to generate, e.g. `'x1 x2'`, via |
| `fallbackSrc` | `string` | — | Shown if `src` fails to load (broken URL, 404). Resets when `src` changes. |
| `fetchpriority` | `"auto" \| "high" \| "low"` | — | Native fetch priority. `high` for the one image that is the page's LCP; leave the rest alone. |
| `format` | `string` | — | Output format to transcode to (`webp`, `avif`, …), via |
| `height` | `string \| number` | — | Intrinsic height. See `width`. |
| `imageClassName` | `string` | — | Classes for the inner image (wrapper gets `className`). |
| `loading` | `"lazy" \| "eager"` | `"lazy"` | Native loading hint. `lazy` defers the fetch until the image nears the viewport; use `eager` for anything above the fold. |
| `objectFit` | `"fill" \| "none" \| "cover" \| "contain" \| "scale-down"` | `"cover"` | How the image fills its box once `aspectRatio` or an explicit size gives it one. |
| `placeholder` | `string \| number \| boolean \| [w: number, h: number, q?: number, b?: number]` | — | Blur-up placeholder generated by |
| `preload` | `boolean \| { fetchPriority: "auto" \| "high" \| "low"; }` | — | Emit a `<link rel="preload">` for this image, via |
| `provider` | `"none" \| (string & {}) \| "ipx"` | — | Which |
| `quality` | `string \| number` | — | Compression quality passed to |
| `sizes` | `string` | — | Responsive `sizes` hint for |
| `skeleton` | `boolean` | `true` | Renders a sibling skeleton overlay while loading (Radix-Avatar 3-state machine). Default true; set false for a bare element. |
| `thumbhash` | `string` | — | A ThumbHash (base64) → a blurred "blur-up" placeholder shown until the image loads, then cross-faded out. Decoded to a tiny image on the client; falls back to the pulse skeleton until decoded (or if the hash is invalid). Implies the wrapper even with `skeleton: false`. |
| `width` | `string \| number` | — | Intrinsic width. Set it together with `height` so the browser reserves the box and the page does not shift as the image arrives. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `error` | `src: string, event?: Event` |
| `load` | `src: string, event?: Event` |

---
本页来源 · KunUI · https://ui.kungal.com/components/image
