# DatePicker (日期选择器)

> 日期 / 日期范围选择器(基于 date-fns),支持格式化、最小/最大值与禁用日期。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="Pick a date" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
  </div>
</template>
```

### Range.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const range = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="range" mode="range" label="选择日期范围" />
    <p class="text-default-600 mt-2 text-sm">起始：{{ range[0] || '—' }}</p>
    <p class="text-default-600 text-sm">结束：{{ range[1] || '—' }}</p>
  </div>
</template>
```

### Precision.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

// `precision` decides what one click commits and which grid the panel opens on.
// It is orthogonal to `mode`, so `range` + `month` is a month range. The emitted
// value is the first instant of the period, formatted to match: 'yyyy-MM-dd',
// 'yyyy-MM', 'yyyy'. The panel header zooms out from wherever it opened.
const day = ref<string | null>('2026-09-05')
const month = ref<string | null>('2026-09')
const year = ref<string | null>('2026')
const yearRange = ref<[string | null, string | null]>(['2018', '2024'])
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <KunDatePicker v-model="day" label="发售日" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ day ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker v-model="month" precision="month" label="收录月份" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ month ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker v-model="year" precision="year" label="出品年份" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ year ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker
        v-model="yearRange"
        precision="year"
        mode="range"
        label="年代区间"
        :min-date="new Date(1995, 0, 1)"
      />
      <p class="text-default-500 mt-1 font-mono text-xs">
        {{ yearRange[0] ?? 'null' }} → {{ yearRange[1] ?? 'null' }}
      </p>
    </div>
  </div>
</template>
```

### Format.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')

// 仅允许选择今天及以后的工作日
const today = new Date()
today.setHours(0, 0, 0, 0)
const isDateDisabled = (d: Date) => {
  const day = d.getDay()
  return d < today || day === 0 || day === 6
}
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker
      v-model="date"
      label="自定义格式与禁用日期"
      format="yyyy 年 MM 月 dd 日"
      :is-date-disabled="isDateDisabled"
    />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
    <p class="text-default-400 text-xs">已禁用过去的日期、周六与周日</p>
  </div>
</template>
```

### Colors.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" color="primary" label="primary" />
    <KunDatePicker v-model="b" color="secondary" label="secondary" />
    <KunDatePicker v-model="c" color="success" label="success" />
  </div>
</template>
```

### States.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref('2026-06-14')
const b = ref('2026-06-14')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" label="可清除（默认）" :clearable="true" />
    <KunDatePicker v-model="b" label="禁用" :disabled="true" />
  </div>
</template>
```

### Error.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="出生日期" error="请选择一个有效的日期" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | `string` | `""` | Extra classes for the outer wrapper. Use `classNames` to reach the trigger, panel, grid or cells. |
| `classNames` | `KunDatePickerClassNames` | — | Per-part class hooks (root / trigger / popup / grid / cell), merged after the component's own classes so yours wins the conflict — KunUI's own `rounded-kun-*` / `shadow-kun-*` / `z-kun-*` scales included. There is no `popupWidth`: the panel is always content-width with a 260px floor and never follows the trigger, so a short pill still gets a full calendar. |
| `clearable` | `boolean` | `true` |  |
| `color` | `KunUIColor` | `"default"` | Focus-ring accent (the resting border/text stay neutral). |
| `darkBorder` | `boolean` | `true` |  |
| `disabled` | `boolean` | `false` |  |
| `error` | `string` | `""` |  |
| `format` | `string` | `'yyyy-MM-dd' \| 'yyyy-MM' \| 'yyyy'` | date-fns pattern for the text shown in the trigger. Defaults follow `precision`. |
| `fullWidth` | `boolean` | `true` | Stretch the control to its container. Turn it off in a filter bar, so the trigger shrinks to its own content. The wrapper shrink-wraps its widest child, so a long `label` or `error` widens it too — a filter pill wants neither. |
| `icon` | `string` | `""` | Icon rendered before the value in the trigger — a filter glyph for a filter bar, a category glyph for a field. The trailing calendar glyph is the disclosure indicator and stays either way. Must be one of the bundled icon names. |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Extra per-cell veto. Called with the FIRST instant of the period a cell covers — the day itself, the 1st of the month, or January 1st — so one predicate works at every precision. |
| `label` | `string` | `""` |  |
| `locale` | `string` | — |  |
| `maxDate` | `string \| Date` | — |  |
| `minDate` | `string \| Date` | — |  |
| `mode` | `KunDatePickerMode` | `"single"` |  |
| `modelValue` | `string \| [string \| null, string \| null] \| null` | `""` |  |
| `months` | `string[]` | — | Full month names. Also the source for the month grid's labels, where the abbreviated form is used unless this overrides it. |
| `placeholder` | `string` | `'请选择日期' \| '请选择月份' \| '请选择年份'` | Trigger text when nothing is selected. Defaults follow `precision`. |
| `precision` | `KunDatePickerPrecision` | `"day"` | What one click commits: a day, a whole month, or a whole year. The panel opens on the matching grid and the value is the first instant of the period, so `month` emits `'2026-09'` and `year` emits `'2026'`. |
| `rounded` | `KunUIRounded` | — | Corner radius. When unset it follows the nearest KunUIConfigProvider's `rounded`. `full` means a pill, which is only defined for the single-line trigger — the floating panel falls back to `lg`, because `9999px` on an n-row panel is clamped by the browser to half its short side. Every other bucket applies to both. |
| `size` | `KunUISize` | `"md"` |  |
| `valueFormat` | `string` | `'yyyy-MM-dd' \| 'yyyy-MM' \| 'yyyy'` | date-fns pattern for the emitted v-model string. Defaults follow `precision`; keep it ISO-shaped so the value parses back. |
| `weekdays` | `string[]` | — |  |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `update:modelValue` | `value: string \| [string \| null, string \| null] \| null` |

---
本页来源 · KunUI · https://ui.kungal.com/components/datepicker
