# Banner (横幅)

> 贴在页面顶部的整宽公告条,一句话加可选的操作与关闭按钮;可以记住关闭状态,刷新后不再出现。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <KunBanner
      v-model="open"
      icon="lucide:info"
      text="论坛将于 9 月 28 日 02:00–04:00 停机维护,期间无法发帖和上传图片。"
    />
    <header class="border-default-200 flex items-center justify-between border-b px-4 py-3">
      <span class="font-bold">Kun<span class="text-primary">Gal</span></span>
      <nav class="text-default-500 flex gap-4 text-sm">
        <span>话题</span><span>Galgame</span><span>排行</span>
      </nav>
    </header>
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">点右侧的 × 关闭横幅,下面的内容会平滑上移。</p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <div class="border-default-200 w-full space-y-px overflow-hidden rounded-lg border">
    <KunBanner
      color="primary"
      :closable="false"
      text="新版本已上线,刷新页面即可体验。"
    />
    <KunBanner
      color="warning"
      icon="lucide:triangle-alert"
      :closable="false"
      text="图片上传暂时变慢,我们正在排查。"
    />
    <KunBanner
      color="danger"
      icon="lucide:circle-x"
      :closable="false"
      text="支付通道维护中,充值功能暂停使用。"
    />
    <KunBanner
      color="success"
      variant="flat"
      icon="lucide:circle-check"
      :closable="false"
      text="你的邮箱已验证,现在可以发帖了。"
    />
    <KunBanner
      color="default"
      variant="flat"
      :closable="false"
      text="本站仅收录已发售作品的资料。"
    />
  </div>
</template>
```

### Actions.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <!-- actions 插槽拿到 dismiss:点"去投票"也会关闭横幅(并触发 close)。 -->
    <KunBanner v-model="open" color="primary" variant="flat">
      2026 年度 Galgame 投票开始了,<a href="#">查看规则</a>。
      <template #actions="{ dismiss }">
        <KunButton size="xs" color="primary" @click="dismiss">去投票</KunButton>
      </template>
    </KunBanner>
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">横幅里的链接自动沿用横幅的文字颜色并加下划线。</p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
```

### Persist.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <!-- 换一条公告就换一个 storage-key,关过旧公告的人会重新看到新的。 -->
    <KunBanner
      v-model="open"
      storage-key="docs-demo-2026-09"
      icon="lucide:info"
      text="关闭这条横幅后刷新页面,它不会再出现。"
    />
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">
        {{ open ? '横幅显示中。' : '已关闭,记录在 localStorage 里,刷新页面试试。' }}
      </p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `locale banner.label` | Accessible name of the banner's region landmark. |
| `className` | `string` | `""` |  |
| `closable` | `boolean` | `true` | Draw a close button. Closing sets `v-model` to `false` and emits `close`; the banner collapses and the page below moves up. |
| `color` | `KunUIColor` | `"primary"` | Semantic colour of the strip. |
| `icon` | `string` | `""` | Bundled icon name shown before the text, e.g. `lucide:info`. Only the icons compiled into ui-core exist — an unbundled name renders nothing. |
| `modelValue` | `boolean` | `true` | Whether the banner is shown. Starts open when unbound; with `storageKey`, a dismissal stored by an earlier visit sets it to `false` after mount. |
| `nonce` | `string` | — | CSP nonce for that inline script. Under a `script-src` that forbids inline scripts and has no nonce for it, a closed banner shows until hydration removes it. |
| `storageKey` | `string` | `""` | Remember the open state in `localStorage` under this key, so a banner the user closed stays closed after a reload, and setting `v-model` back to `true` clears the record. Give each announcement its own key: a new key shows again to everyone who closed the old one. Characters other than letters, digits, `-` and `_` become `-`. A small inline script rendered in front of the banner hides a closed one before first paint, so a server-rendered page neither flashes it nor shifts. |
| `text` | `string` | `""` | The one sentence the banner carries. For markup (a link, bold text) use the default slot, which renders in its place. |
| `variant` | `"flat" \| "solid"` | `"solid"` | `solid` fills the strip with the colour and a contrast-correct foreground; `flat` is a soft tint with coloured text. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `close` | — |
| `update:modelValue` | `value: boolean` |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#actions` | `{ dismiss: () => void; }` |
| `#default` | `{ dismiss: () => void; }` |

---
本页来源 · KunUI · https://ui.kungal.com/components/banner
