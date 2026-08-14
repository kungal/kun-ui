# Reaction (点赞)

> 点赞 / 表态(v-model + 计数),紧凑胶囊,带填充变色、弹跳、爆裂光环与数字滚动动画。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// v-model = 点赞状态;v-model:count = 计数(组件点击时自动 ±1,可被服务端值覆盖)。
const liked = ref(false)
const count = ref(128)
</script>

<template>
  <KunReaction v-model="liked" v-model:count="count" />
</template>
```

### Variants.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 换 icon + color 即可变成「顶 / 收藏」等不同表态。
const like = ref(false)
const likeN = ref(42)
const up = ref(true)
const upN = ref(7)
const star = ref(false)
const starN = ref(15)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction
      v-model="like"
      v-model:count="likeN"
      icon="lucide:heart"
      color="danger"
      label="点赞"
    />
    <KunReaction
      v-model="up"
      v-model:count="upN"
      icon="lucide:thumbs-up"
      color="primary"
      label="顶"
    />
    <KunReaction
      v-model="star"
      v-model:count="starN"
      icon="lucide:star"
      color="warning"
      label="收藏"
    />
  </div>
</template>
```

### Sizes.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
const ac = ref(3)
const bc = ref(88)
const cc = ref(1024)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction v-model="a" v-model:count="ac" size="sm" />
    <KunReaction v-model="b" v-model:count="bc" size="md" />
    <KunReaction v-model="c" v-model:count="cc" size="lg" />
  </div>
</template>
```

### ToggleOnly.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 不传 count 就是纯切换(收藏 / 喜欢这类无需计数的场景)。
const liked = ref(false)
const fav = ref(true)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction v-model="liked" label="喜欢" />
    <KunReaction v-model="fav" icon="lucide:bookmark" color="primary" label="收藏" />
  </div>
</template>
```

### Custom.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// #icon 插槽:任意字形(emoji / 图片 / SVG),可按 active 换;
// color:除调色板外,也接受任意 CSS 颜色(品牌色)——填充 / 弹跳 / 爆裂全跟着它走。
const pushed = ref(false)
const pushN = ref(233)
const loved = ref(true)
const loveN = ref(66)
</script>

<template>
  <div class="flex items-center gap-5">
    <!-- 「推」:emoji 自定义字形(选中前后不同)+ 品牌橙 -->
    <KunReaction v-model="pushed" v-model:count="pushN" color="#ff6a00" label="推">
      <template #icon="{ active }">
        <span class="leading-none">{{ active ? '🔥' : '➕' }}</span>
      </template>
    </KunReaction>

    <!-- 默认心形,只换任意品牌色(紫) -->
    <KunReaction v-model="loved" v-model:count="loveN" color="#8b5cf6" label="紫心" />
  </div>
</template>
```

### ActionRow.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// One cohesive actions row, all KunReaction: 点赞 is a toggle (default);
// 评论 / 分享 / 更多 are `:toggle="false"` actions (no pressed state, no burst —
// just a tactile pop) handled with a native @click. Same compact skin throughout.
const liked = ref(false)
const likes = ref(128)
const shares = ref(12)
</script>

<template>
  <div class="flex items-center gap-1">
    <KunReaction v-model="liked" v-model:count="likes" label="点赞" />
    <KunReaction
      :toggle="false"
      :count="34"
      icon="lucide:message-circle"
      label="评论"
    />
    <KunReaction
      :toggle="false"
      :count="shares"
      icon="lucide:repeat-2"
      label="转发"
      @click="shares++"
    />
    <KunReaction :toggle="false" icon="lucide:ellipsis" label="更多" />
  </div>
</template>
```

### Labeled.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 默认插槽 = 可见文字 label,渲染在按钮内部,所以点图标 / 文字 / 计数任意处都切换。
const favGame = ref(false)
const favRes = ref(true)
const likes = ref(128)
const liked = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunReaction v-model="favGame" icon="lucide:star" color="warning">
      {{ favGame ? '已收藏' : '收藏游戏' }}
    </KunReaction>

    <KunReaction v-model="favRes" icon="lucide:bookmark" color="primary">
      {{ favRes ? '已收藏' : '收藏资源' }}
    </KunReaction>

    <!-- label + 计数也可以一起 -->
    <KunReaction v-model="liked" v-model:count="likes">点赞</KunReaction>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `color` | `KunUIColor \| (string & {})` | `"danger"` | Active (liked) colour — a palette key OR any CSS colour string (e.g. a brand `#ff6a00`). The icon fill, pop and burst all follow it. Default `danger`. |
| `count` | `number` | `undefined` |  |
| `disableAnimation` | `boolean` | `false` | Disable the pop / burst / count-roll animations (also off under reduced-motion). |
| `disabled` | `boolean` | `false` |  |
| `icon` | `string` | `"lucide:heart"` | Icon name (default a heart); filled + coloured when active. Override the whole glyph (emoji / image / per-state) with the `#icon` slot instead. |
| `label` | `string` | `"点赞"` | Accessible label base; the count is appended for the full name. Default `点赞`. |
| `modelValue` | `boolean` | `false` |  |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |  |
| `toggle` | `boolean` | `true` | `true` (default) = a like/press TOGGLE: pressed state (`aria-pressed`), icon fill + colour, and a celebratory burst. `false` = a one-shot ACTION (share / more …) in the same compact skin — no self-toggle, no burst, just a tactile pop; handle the click with a native `@click`. Lets a whole reactions row use one component instead of mixing in a heavier icon button. In BOTH modes the filled/coloured skin follows the `active` model. So an action-mode reaction can be a controlled "menu button": wrap it as a `KunPopover` trigger, bind `:model-value` to your own state (e.g. 收藏 = "in ≥1 list"), and the click opens the picker instead of self-toggling. |

---
本页来源 · KunUI · https://ui.kungal.com/components/reaction
