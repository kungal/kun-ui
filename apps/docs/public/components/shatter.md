# Shatter (碎裂)

> 把任意内容像玻璃一样打碎成碎片飞散消失:零运行时依赖,Voronoi 碎片几何 + 仅合成器线程(transform/opacity)的动画,稳定 60fps;支持点击/指令/v-model 触发,尊重 reduced-motion。

## 示例

### ComplexCard.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 一个「真实」的复杂组件:封面图 + 标题 + 评分 + 标签 + 简介 + 按钮。
// 点「打碎这张卡片」即把整张卡(连同里面的图片与文字)碎成玻璃片飞散。
const card = ref<{ shatter: () => void; restore: () => void } | null>(null)
const gone = ref(false)
const shatter = () => {
  card.value?.shatter()
  gone.value = true
}
const restore = () => {
  card.value?.restore()
  gone.value = false
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <KunShatter ref="card" :pieces="46" :duration="1200" :rotation="120">
      <article
        class="border-default-200 bg-content1 rounded-kun-xl w-[330px] overflow-hidden border shadow-lg"
      >
        <div class="relative h-40 w-full">
          <img
            src="/banner.webp"
            alt="cover"
            draggable="false"
            class="h-full w-full object-cover"
          />
          <span
            class="absolute top-3 left-3 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
          >
            Galgame
          </span>
          <span
            class="bg-warning absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          >
            NEW
          </span>
        </div>

        <div class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-default-900 truncate text-base font-semibold">星空下的约定</h3>
              <p class="text-default-500 text-xs">Studio Moonlit · 2026</p>
            </div>
            <KunRating :model-value="4" readonly size="sm" />
          </div>

          <div class="flex flex-wrap gap-1.5">
            <KunChip size="sm" color="primary" variant="flat">恋爱</KunChip>
            <KunChip size="sm" color="secondary" variant="flat">治愈</KunChip>
            <KunChip size="sm" variant="flat">校园</KunChip>
          </div>

          <p class="text-default-600 text-sm leading-relaxed">
            转学生在天文社遇见了她——一段关于星空、约定与离别的夏日物语,在蝉鸣声中悄然展开。
          </p>

          <KunButton size="sm" color="primary" class="w-full" @click="shatter">
            打碎这张卡片
          </KunButton>
        </div>
      </article>
    </KunShatter>

    <KunButton v-if="gone" size="sm" variant="flat" @click="restore">重新组合</KunButton>
  </div>
</template>
```

### Basic.vue

```vue
<script setup lang="ts">
// 点击卡片任意位置即可「打碎」它——碎裂从点击点向外炸开、在重力下飞散坠落,
// 1.6s 后自动复原。整个飞散只跑 transform / opacity。
</script>

<template>
  <KunShatter trigger="click" :auto-restore="1600" keep-space class="cursor-pointer">
    <div
      class="border-default-200 bg-content1 rounded-kun-lg flex w-64 items-center gap-3 border p-4 shadow-sm select-none"
    >
      <div class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full text-2xl">
        🌸
      </div>
      <div>
        <p class="text-default-900 font-semibold">点击打碎我</p>
        <p class="text-default-500 text-xs">从点击点炸开 · 自动复原</p>
      </div>
    </div>
  </KunShatter>
</template>
```

### ImageShatter.vue

```vue
<script setup lang="ts">
// 最常见的 ACGN 场景:点击打碎一张图片。每个碎片携带它对应的那一块图像切片飞散。
// 直接克隆真实 DOM,无需 canvas 截图,也没有跨域 taint 问题。
</script>

<template>
  <KunShatter
    trigger="click"
    :pieces="30"
    :auto-restore="1400"
    keep-space
    class="cursor-pointer"
  >
    <img
      src="/kungalgame.webp"
      alt="kungalgame"
      width="288"
      height="180"
      draggable="false"
      class="rounded-kun-lg h-[180px] w-72 select-none object-cover shadow-lg"
    />
  </KunShatter>
</template>
```

### Model.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 用 v-model:shattered 声明式地控制碎裂——像「带玻璃碎裂的 v-if」。
// keep-space 让原位保留占位,碎裂后周围布局不跳动。
const broken = ref(false)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" @click="broken = !broken">
      {{ broken ? '复原' : '打碎' }}
    </KunButton>

    <KunShatter v-model:shattered="broken" :pieces="30" keep-space>
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex w-64 flex-col gap-1 border p-4 shadow-sm select-none"
      >
        <p class="text-default-900 font-semibold">v-model 控制</p>
        <p class="text-default-500 text-sm">设 shattered = true 即碎裂,false 复原。</p>
      </div>
    </KunShatter>
  </div>
</template>
```

### Origin.vue

```vue
<script setup lang="ts">
// origin 决定碎裂从哪一点向外炸开:center(默认)、top、pointer(上次指针位置),
// 也可传 { x, y } 像素坐标。点击各卡片对比。
const origins = ['center', 'top', 'pointer'] as const
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <KunShatter
      v-for="o in origins"
      :key="o"
      trigger="click"
      :origin="o"
      :auto-restore="1500"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-28 w-36 flex-col items-center justify-center gap-1 border shadow-sm select-none"
      >
        <span class="text-default-400 text-xs">origin</span>
        <code class="text-primary text-sm font-semibold">{{ o }}</code>
      </div>
    </KunShatter>
  </div>
</template>
```

### Pieces.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 碎片数(pieces)由 Voronoi 胞元决定,2–160 之间钳制。无论多少片,飞散动画都只在
// 合成器线程跑;一次性构建成本被裁到 ≈ 元素自身面积(每片只绘自己那一小块切片)。
const pieces = ref(28)
</script>

<template>
  <div class="flex w-72 flex-col gap-3">
    <label class="text-default-500 text-sm">碎片数:{{ pieces }}</label>
    <KunSlider v-model="pieces" :min="4" :max="120" :step="1" />

    <KunShatter
      trigger="click"
      :pieces="pieces"
      :auto-restore="1500"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-32 w-72 items-center justify-center border shadow-sm select-none"
      >
        <span class="text-default-700 font-semibold">点击打碎 · {{ pieces }} 片</span>
      </div>
    </KunShatter>
  </div>
</template>
```

### Physics.vue

```vue
<script setup lang="ts">
// 用 gravity(重力)、spread(飞散距离)、rotation(自旋)组合出不同手感。
// 重力以 t² 加速度施加,所以「重力坠落」是真正的加速下坠,而非匀速平移。
const presets = [
  { name: '轻盈飘散', gravity: 0.35, spread: 1.2, rotation: 90 },
  { name: '重力坠落', gravity: 2.4, spread: 0.45, rotation: 80 },
  { name: '猛烈炸裂', gravity: 0.5, spread: 1.9, rotation: 240 },
]
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <KunShatter
      v-for="p in presets"
      :key="p.name"
      trigger="click"
      :gravity="p.gravity"
      :spread="p.spread"
      :rotation="p.rotation"
      :auto-restore="1600"
      keep-space
      class="cursor-pointer"
    >
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex h-28 w-36 items-center justify-center border shadow-sm select-none"
      >
        <span class="text-default-700 text-sm font-semibold">{{ p.name }}</span>
      </div>
    </KunShatter>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `autoRestore` | `number` | `0` | Auto re-form this many ms after the break completes (0 = stay shattered). Default 0. |
| `className` | `string` | `""` | Extra classes for the wrapper. |
| `disableAnimation` | `boolean` | `false` | Skip the shard animation and hide instantly. Also forced under `prefers-reduced-motion`. Default false. |
| `disabled` | `boolean` | `false` | Disable shattering entirely — the content stays put. Default false. |
| `duration` | `number` | `1100` | Fly-apart duration in ms. Default 1100. |
| `easing` | `string` | `"linear"` | Animation-level CSS easing. Default `linear` — the natural ballistic motion is baked into each shard's sampled keyframes, so override this only to time-warp the whole flight. |
| `fade` | `boolean` | `true` | Fade shards out as they fly (false = keep full opacity, e.g. flying off-screen). Default true. |
| `gravity` | `number` | `1` | Downward gravity pull on the shards (0 = a pure radial burst). Default 1. |
| `keepSpace` | `boolean` | `false` | Keep the original's layout space after it shatters (`visibility:hidden`) instead of collapsing it (`display:none`). Default false. |
| `origin` | `KunShatterOrigin` | `"center"` | Where the break originates — shards fly outward from here. `center` (default), `top`, `pointer` (last pointer position over the content), or `{ x, y }` px. |
| `pieces` | `number` | `24` | Target number of glass shards (Voronoi cells); clamped to 2–160. Default 24. Fewer is cheaper to build, but the fly-apart stays compositor-only regardless. |
| `reassemble` | `boolean` | `true` | Animate the re-form when restoring — a reverse "reassemble" where the same shards fly back in from where they scattered and settle into place. `false` snaps the content back instantly. Default true. |
| `rotation` | `number` | `140` | Maximum random spin per shard, in degrees. Default 140. |
| `seed` | `number` | — | Deterministic shard pattern: the same seed reproduces the same break (handy for visual tests). Omit for a fresh random shatter each time. |
| `shattered` | `boolean` | `false` |  |
| `spread` | `number` | `1` | How far the shards travel, as a multiplier. Default 1. |
| `trigger` | `"click" \| "manual"` | `"manual"` | How the break is triggered. `manual` (default) = drive it via `v-model:shattered` or the exposed `shatter()` method; `click` = clicking the content shatters it, and the click point becomes the impact origin. |
| `zIndex` | `number` | `9999` | z-index of the body-level shard overlay. Default 9999. |

---
本页来源 · KunUI · https://ui.kungal.com/components/shatter
