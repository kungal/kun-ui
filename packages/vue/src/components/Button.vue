<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  cn,
  kunVariantClasses,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunControlSquareClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useRipple } from '../composables/useRipple'
import { extractTextFromVNodes } from '../utils/extractTextFromVNodes'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunIcon from './Icon.vue'
import KunRipple from './Ripple.vue'
import type { KunButtonProps } from './types'

// Nuxt-decoupled Button. Every dependency that used to come from Nuxt
// auto-imports is now explicit:
//   - vue primitives (computed/useSlots) imported from 'vue'
//   - cn / variant matrix / radius map from @kungal/ui-core
//   - KunIcon / KunRipple imported as real components (not global refs)
//   - the NuxtLink (`defineNuxtLink`) is replaced by config.linkComponent
defineOptions({ name: 'KunButton' })

const props = withDefaults(defineProps<KunButtonProps>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  // No `rounded` default: defer to the global config.rounded (default 'md') so
  // buttons share one radius with every other component. Pass `rounded` to override.
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  isIconOnly: false,
  icon: false,
  iconPosition: 'left',
  className: '',
  href: '',
  target: '_self',
  ariaLabel: '',
})

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()
const config = useKunUIConfig()

const computedAriaLabel = computed(() => {
  if (props.ariaLabel) {
    return props.ariaLabel
  }
  if (props.isIconOnly) {
    return 'button'
  }
  if (slots.default) {
    const slotText = extractTextFromVNodes(slots.default()).trim()
    return slotText || ''
  }
  return ''
})

const sizeClasses = computed(() => {
  // Shared form-control scale (px:py 2:1, md anchor) so a button lines up with
  // an input / select / textarea of the same size. See kunControlSizeClasses.
  return kunControlSizeClasses[props.size]
})

// Button delegates the whole variant × color matrix to @kungal/ui-core so the
// 7 × 7 table lives in exactly one place across every framework layer.
const colorClasses = computed(() =>
  kunVariantClasses(props.variant, props.color)
)

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// Icon-only buttons become a fixed SQUARE equal to the same-size text button's
// height (kunControlSquareClasses), so icon + text buttons line up in a row. The
// square overrides the inherited px/py (its `p-0`) but keeps `text-*`, so the
// icon stays at its natural 1em, centered. See kunControlSquareClasses.
const isIconOnlyClasses = computed(() =>
  props.isIconOnly ? kunControlSquareClasses[props.size] : ''
)

const { ripples, onClick } = useRipple()

const isInactive = computed(() => props.disabled || props.loading)

// In link mode the destination goes to `href` for a native <a>, or to `to`
// for a RouterLink/NuxtLink component (matching their convention). `disabled`
// is omitted in link mode (a no-op on <a>); the JS guard below blocks
// navigation and `isInactive` advertises the state visually.
const rootIs = computed(() => (props.href ? config.linkComponent : 'button'))
const rootBindings = computed<Record<string, unknown>>(() => {
  if (props.href) {
    const dest =
      typeof config.linkComponent === 'string'
        ? { href: props.href }
        : { to: props.href }
    return {
      ...dest,
      target: props.target,
      // target="_blank" without rel="noopener" is a tabnabbing risk.
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
      role: 'link',
      'aria-label': computedAriaLabel.value,
    }
  }
  return {
    type: props.type,
    disabled: props.disabled || props.loading,
    role: 'button',
    'aria-label': computedAriaLabel.value,
  }
})

// Disabled-state guard runs in JS, not only via :disabled — the latter is a
// no-op when rendering as a link (<a>/RouterLink): the link would still
// navigate. preventDefault blocks that; the early return blocks emit + ripple.
const handleKunButtonClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  onClick(event)
  emits('click', event)
}
</script>

<template>
  <component
    :is="rootIs"
    v-bind="rootBindings"
    :class="
      cn(
        // A button label is one atomic action — keep it on a single line
        // (`whitespace-nowrap`) and never let the icons squish (`[&_svg]:shrink-0`),
        // matching shadcn / Material's button behaviour.
        'relative inline-flex cursor-pointer items-center justify-center gap-1 overflow-hidden font-medium whitespace-nowrap transition-all hover:opacity-80 active:scale-[0.97] [&_svg]:shrink-0',
        // Offset ring (gap against the fill) so the keyboard-focus ring reads on
        // solid buttons too — same recipe as every other control, just spaced out.
        cn(kunFocusRingClasses[color], 'focus-visible:ring-offset-2 focus-visible:ring-offset-background'),
        sizeClasses,
        colorClasses,
        roundedClass,
        fullWidth ? 'w-full' : '',
        isIconOnlyClasses,
        isInactive && 'pointer-events-none cursor-not-allowed opacity-50 hover:bg-none',
        className
      )
    "
    @click="handleKunButtonClick"
  >
    <KunIcon
      v-if="loading"
      class="text-sm"
      name="svg-spinners:90-ring-with-bg"
    />
    <span v-if="icon && iconPosition === 'left'" class="mr-2 shrink-0">
      <slot name="icon" />
    </span>
    <slot />
    <span v-if="icon && iconPosition === 'right'" class="ml-2 shrink-0">
      <slot name="icon" />
    </span>

    <KunRipple :ripples="ripples" />
  </component>
</template>
