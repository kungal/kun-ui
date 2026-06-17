<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import {
  cn,
  kunBgClasses,
  kunTextClasses,
  kunBorderClasses,
} from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { kunTabId, kunTabPanelId } from '../composables/tabPanelsContext'
import KunIcon from './Icon.vue'
import type { KunTabItem, KunTabColor, KunTabSize, KunTabProps } from './types'

// Nuxt-decoupled Tab. Two coupling points fixed:
//   - `navigateTo(href)` → `config.navigate(href)` (injectable; the Nuxt
//     layer wires it to NuxtLink's navigateTo, plain Vue does a full nav)
//   - `import.meta.dev` → `import.meta.env.DEV` (Vite standard; also true
//     under Nuxt's Vite build)
defineOptions({ name: 'KunTab' })

const props = withDefaults(defineProps<KunTabProps>(), {
  variant: 'underlined',
  color: 'primary',
  size: 'md',
  orientation: 'horizontal',
  fullWidth: false,
  align: 'center',
  disabled: false,
  disableAnimation: false,
  scrollable: false,
  iconSize: '1em',
  className: '',
  innerClassName: '',
})

const value = defineModel<string>({ required: true })
const emit = defineEmits<{ change: [value: string] }>()
const config = useKunUIConfig()

const isVertical = computed(() => props.orientation === 'vertical')

const sizeClasses: Record<KunTabSize, string> = {
  sm: 'text-sm px-2.5 py-1.5',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5',
}

const sizeGap: Record<KunTabSize, string> = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
}

const tabRefs = ref<HTMLElement[]>([])

const setTabRef = (
  el: Element | null | { $el?: Element } | undefined,
  idx: number
) => {
  const node =
    el && typeof el === 'object' && '$el' in el
      ? ((el as { $el?: Element }).$el ?? null)
      : (el as Element | null)
  if (node instanceof HTMLElement) {
    tabRefs.value[idx] = node
  } else if (el != null && import.meta.env.DEV) {
    console.warn('[KunTab] unexpected ref payload at index', idx, el)
  }
}

const currentIndex = computed(() =>
  props.items.findIndex((i) => i.value === value.value)
)

const indicatorStyle = ref<Record<string, string>>({})

const updateIndicator = () => {
  const idx = currentIndex.value
  const el = tabRefs.value[idx]
  if (!el) {
    indicatorStyle.value = {}
    return
  }
  const isLine = props.variant === 'underlined'
  if (isVertical.value) {
    indicatorStyle.value = isLine
      ? {
          transform: `translateY(${el.offsetTop}px)`,
          height: `${el.offsetHeight}px`,
          width: '2px',
        }
      : {
          transform: `translate(${el.offsetLeft}px, ${el.offsetTop}px)`,
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`,
        }
  } else {
    indicatorStyle.value = isLine
      ? {
          transform: `translateX(${el.offsetLeft}px)`,
          width: `${el.offsetWidth}px`,
          height: '2px',
        }
      : {
          transform: `translate(${el.offsetLeft}px, ${el.offsetTop}px)`,
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`,
        }
  }
}

watch(
  [value, () => props.items.length, () => props.orientation],
  () => nextTick(updateIndicator),
  { immediate: true }
)

// The sliding indicator is measured from the DOM (offsetLeft/offsetWidth), so it
// CANNOT exist in server-rendered HTML — until the client mounts, the active tab
// falls back to a CSS highlight (see tabClasses, gated on `!showIndicator`).
// Measure on mount (the DOM is guaranteed present) and re-measure whenever the
// list resizes — web-font swaps, container width changes and item changes all
// shift tab widths, which would otherwise leave the indicator stale.
const listRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(updateIndicator)
  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    resizeObserver = new ResizeObserver(() => updateIndicator())
    resizeObserver.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

const focusTab = (idx: number) => {
  const el = tabRefs.value[idx]
  if (el) el.focus()
}

const moveFocus = (delta: number, e?: KeyboardEvent) => {
  e?.preventDefault()
  const enabled = props.items
    .map((it, i) => (it.disabled || props.disabled ? -1 : i))
    .filter((i) => i >= 0)
  if (!enabled.length) return
  const cur = enabled.indexOf(currentIndex.value)
  let nextIdx: number | undefined
  if (cur < 0) {
    nextIdx = enabled[delta > 0 ? 0 : enabled.length - 1]
  } else {
    nextIdx = enabled[(cur + delta + enabled.length) % enabled.length]
  }
  if (nextIdx === undefined) return
  const item = props.items[nextIdx]
  if (item) {
    void selectTab(item, nextIdx)
    focusTab(nextIdx)
  }
}

const onKeydown = (e: KeyboardEvent, idx: number) => {
  if (props.disabled) return
  const forward = isVertical.value ? 'ArrowDown' : 'ArrowRight'
  const backward = isVertical.value ? 'ArrowUp' : 'ArrowLeft'
  switch (e.key) {
    case forward:
      moveFocus(1, e)
      break
    case backward:
      moveFocus(-1, e)
      break
    case 'Home':
      e.preventDefault()
      {
        const first = props.items.findIndex(
          (it) => !(it.disabled || props.disabled)
        )
        if (first >= 0 && props.items[first]) {
          void selectTab(props.items[first], first)
          focusTab(first)
        }
      }
      break
    case 'End':
      e.preventDefault()
      for (let i = props.items.length - 1; i >= 0; i--) {
        const it = props.items[i]
        if (it && !(it.disabled || props.disabled)) {
          void selectTab(it, i)
          focusTab(i)
          break
        }
      }
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      const item = props.items[idx]
      if (item) void selectTab(item, idx)
      break
    }
  }
}

const selectTab = async (item: KunTabItem, _idx: number) => {
  if (props.disabled || item.disabled) return
  // `change` only fires when value actually changes (idempotent re-click is
  // not a "change"). Href navigation still happens on every click.
  if (value.value !== item.value) {
    value.value = item.value
    emit('change', item.value)
  }
  if (item.href) {
    await config.navigate(item.href)
  }
}

// `href` tabs render a real <a> / link (crawlable, works without JS). With JS we
// intercept the click and route through config.navigate (SPA under Nuxt) so we
// don't double-navigate; without JS the native href is the graceful fallback.
const tabIs = (item: KunTabItem) => (item.href ? config.linkComponent : 'button')
const tabBindings = (item: KunTabItem) => {
  if (!item.href) return { type: 'button', disabled: item.disabled || props.disabled }
  return typeof config.linkComponent === 'string'
    ? { href: item.href }
    : { to: item.href }
}
const onTabClick = (e: MouseEvent, item: KunTabItem, idx: number) => {
  if (item.href) e.preventDefault()
  void selectTab(item, idx)
}
const tabIdFor = (v: string) => kunTabId(props.name, v)
const panelIdFor = (v: string) => kunTabPanelId(props.name, v)

const isSelected = (item: KunTabItem) => value.value === item.value

const containerClasses = computed(() =>
  cn(
    'relative',
    isVertical.value ? 'inline-flex flex-col' : 'inline-flex',
    props.fullWidth && 'w-full',
    props.disabled && 'opacity-50 cursor-not-allowed',
    props.scrollable &&
      (isVertical.value
        ? 'max-h-full overflow-y-auto scrollbar-hide'
        : 'max-w-full overflow-x-auto scrollbar-hide'),
    props.className
  )
)

const listClasses = computed(() => {
  const base = isVertical.value
    ? cn('relative flex flex-col items-stretch', sizeGap[props.size])
    : cn('relative flex items-center', sizeGap[props.size])
  switch (props.variant) {
    case 'underlined':
      // No static track line — only the sliding active indicator.
      return cn(base, props.innerClassName)
    case 'solid':
    case 'light':
      return cn(
        base,
        'border border-kun rounded-kun-lg p-1 bg-content2/30',
        props.innerClassName
      )
    case 'bordered':
      return cn(
        base,
        'border border-kun rounded-kun-lg p-1',
        props.innerClassName
      )
    case 'pills':
      return cn(base, props.innerClassName)
    default:
      return cn(base, props.innerClassName)
  }
})

const alignClass: Record<NonNullable<KunTabProps['align']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

const tabClasses = (item: KunTabItem) => {
  const selected = isSelected(item)
  const base = cn(
    'relative z-10 inline-flex items-center cursor-pointer select-none whitespace-nowrap transition-colors',
    alignClass[props.align],
    sizeClasses[props.size],
    sizeGap[props.size],
    item.disabled && 'opacity-50 cursor-not-allowed',
    isVertical.value && props.fullWidth && 'w-full'
  )
  // These three variants show the active state via the JS-measured sliding
  // indicator, which is absent until the client mounts. `!showIndicator` is true
  // on the server and through hydration, so the selected tab carries a CSS-only
  // active highlight then; once the indicator is measured it takes over and this
  // fallback drops — no hydration mismatch (the swap happens post-mount).
  const fallback = !showIndicator.value
  switch (props.variant) {
    case 'underlined':
      // The pre-hydration underline is drawn via an inline box-shadow (see
      // tabStyle) rather than a class — an arbitrary inset-shadow utility isn't
      // reliably generated, and an inline style always renders in SSR HTML.
      return cn(
        base,
        selected
          ? kunTextClasses[props.color]
          : 'text-default-500 hover:text-foreground'
      )
    case 'solid':
      return cn(
        base,
        'rounded-kun-md',
        selected
          ? cn('text-white', fallback && kunBgClasses[props.color])
          : 'text-default-500 hover:text-foreground'
      )
    case 'light':
      return cn(
        base,
        'rounded-kun-md',
        selected
          ? cn(kunTextClasses[props.color], fallback && softBgByColor[props.color])
          : 'text-default-500 hover:text-foreground'
      )
    case 'bordered':
      return cn(
        base,
        'rounded-kun-md border',
        selected
          ? cn(kunBorderClasses[props.color], kunTextClasses[props.color])
          : 'border-transparent text-default-500 hover:text-foreground'
      )
    case 'pills':
      return cn(
        base,
        'rounded-full',
        selected
          ? cn(kunBgClasses[props.color], 'text-white')
          : 'text-default-500 hover:text-foreground'
      )
    default:
      return base
  }
}

// SSR / pre-hydration fallback for the underlined variant: a 2px inset bottom
// bar on the active tab itself (currentColor = its active text color). Inline so
// it always renders server-side; once the measured indicator exists it drops.
const tabStyle = (item: KunTabItem) =>
  props.variant === 'underlined' && isSelected(item) && !showIndicator.value
    ? { boxShadow: 'inset 0 -2px 0 0 currentColor' }
    : undefined

// Soft tint for the light variant's sliding panel (15% — a touch stronger
// than @kungal/ui-core's kunSoftBgClasses 5%). Static literals for the JIT.
const softBgByColor: Record<KunTabColor, string> = {
  default: 'bg-default/15',
  primary: 'bg-primary/15',
  secondary: 'bg-secondary/15',
  success: 'bg-success/15',
  warning: 'bg-warning/15',
  danger: 'bg-danger/15',
  info: 'bg-info/15',
}

const indicatorClasses = computed(() => {
  switch (props.variant) {
    case 'underlined':
      return cn(
        'absolute rounded-full',
        kunBgClasses[props.color],
        isVertical.value ? 'left-0 top-0' : 'bottom-0 left-0'
      )
    case 'solid':
      return cn('absolute top-0 left-0 rounded-kun-md', kunBgClasses[props.color])
    case 'light':
      return cn('absolute top-0 left-0 rounded-kun-md', softBgByColor[props.color])
    default:
      return null
  }
})

const showIndicator = computed(
  () =>
    !!indicatorClasses.value &&
    currentIndex.value >= 0 &&
    Object.keys(indicatorStyle.value).length > 0
)

const indicatorMergedStyle = computed(() => {
  const base = { ...indicatorStyle.value }
  if (!props.disableAnimation) {
    // The indicator slides via `transform` (compositor); only its width changes
    // between tabs (a single tiny element, so transitioning width is fine).
    // Height is constant across same-row tabs — don't transition it.
    base.transition =
      'transform var(--kun-dur-base) var(--ease-kun-standard), width var(--kun-dur-base) var(--ease-kun-standard)'
  }
  return base
})
</script>

<template>
  <div :class="containerClasses">
    <div
      ref="listRef"
      :class="listClasses"
      role="tablist"
      :aria-orientation="orientation"
    >
      <div
        v-if="showIndicator"
        aria-hidden="true"
        :class="indicatorClasses!"
        :style="indicatorMergedStyle"
      />

      <component
        :is="tabIs(item)"
        v-for="(item, index) in items"
        :key="item.value"
        :ref="(el: unknown) => setTabRef(el as Element | null, index)"
        v-bind="tabBindings(item)"
        :id="tabIdFor(item.value)"
        role="tab"
        :aria-controls="panelIdFor(item.value)"
        :aria-selected="isSelected(item)"
        :aria-disabled="item.disabled || disabled"
        :tabindex="isSelected(item) && !item.disabled && !disabled ? 0 : -1"
        :class="tabClasses(item)"
        :style="tabStyle(item)"
        @click="onTabClick($event, item, index)"
        @keydown="onKeydown($event, index)"
      >
        <span
          v-if="item.icon"
          class="inline-flex shrink-0"
          :style="{ fontSize: iconSize }"
        >
          <KunIcon :name="item.icon" />
        </span>
        <span v-if="item.textValue">{{ item.textValue }}</span>
      </component>
    </div>
  </div>
</template>
