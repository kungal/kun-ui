# Accordion (手风琴)

> 可折叠区块(KunAccordion + KunAccordionItem):单开/多开、v-model、grid 揭示动画,SSR 安全且无障碍。

## 示例

### Basic.vue

```vue
<template>
  <KunAccordion class-name="max-w-lg">
    <KunAccordionItem value="what" title="KunUI 是什么?">
      专为 ACGN 网站设计的现代无头 UI 组件库,支持 Vue / Nuxt。
    </KunAccordionItem>
    <KunAccordionItem value="ssr" title="支持 SSR 吗?">
      支持。组件以 SSR 安全为前提设计,水合无闪烁。
    </KunAccordionItem>
    <KunAccordionItem value="a11y" title="无障碍如何?">
      头部是真正的按钮(aria-expanded / aria-controls),内容区域用 role=region 关联。
    </KunAccordionItem>
  </KunAccordion>
</template>
```

### Multiple.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref<string[]>(['a'])
</script>

<template>
  <KunAccordion v-model="open" multiple class-name="max-w-lg">
    <KunAccordionItem value="a" title="可以同时展开多个" icon="lucide:check">
      传入 multiple 后,多个区块可同时打开;v-model 绑定一个数组。
    </KunAccordionItem>
    <KunAccordionItem value="b" title="第二个区块" icon="lucide:check">
      当前展开:{{ open.join(', ') || '无' }}
    </KunAccordionItem>
    <KunAccordionItem value="c" title="第三个区块" icon="lucide:check">
      点击多个头部试试。
    </KunAccordionItem>
  </KunAccordion>
</template>
```

### Variants.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-6">
    <KunAccordion variant="bordered" default-value="x">
      <KunAccordionItem value="x" title="Bordered 变体">外框 + 分隔线。</KunAccordionItem>
      <KunAccordionItem value="y" title="第二项">描边容器内分隔。</KunAccordionItem>
    </KunAccordion>
    <KunAccordion variant="splitted" default-value="x">
      <KunAccordionItem value="x" title="Splitted 变体">每个区块是独立卡片。</KunAccordionItem>
      <KunAccordionItem value="y" title="第二项">区块之间有间距。</KunAccordionItem>
    </KunAccordion>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | `string` | `""` |  |
| `defaultValue` | `string \| string[]` | `undefined` | Initially-open value(s) when uncontrolled (no v-model). |
| `modelValue` | `string \| string[]` | `undefined` |  |
| `multiple` | `boolean` | `false` | Allow multiple sections open at once (default single-open). |
| `variant` | `"light" \| "bordered" \| "splitted"` | `"light"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/accordion
