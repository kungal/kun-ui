<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunRoundedClasses, type KunUIColor } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useRipple } from '../composables/useRipple'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunRipple from './Ripple.vue'
import type { KunCardProps } from './types'

// KunCard renders as one of three elements (priority: href > clickable > div):
//   1. `href`      → config.linkComponent  (was <NuxtLink>)
//   2. `clickable` → <button>  (cursor/active-scale + ripple)
//   3. neither     → static <div>
// `@click` is emitted in ALL three modes; only the ripple + interactive
// styling are gated on isInteractive.
defineOptions({ name: 'KunCard' })

const props = withDefaults(defineProps<KunCardProps>(), {
  clickable: false,
  href: undefined,
  isHoverable: false,
  isTransparent: false,
  bordered: true,
  className: '',
  contentClass: '',
  rounded: undefined,
  color: 'background',
  darkBorder: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const config = useKunUIConfig()
const { ripples, onClick } = useRipple()

const isInteractive = computed(() => !!props.href || props.clickable)

const renderAs = computed(() => {
  if (props.href) return config.linkComponent
  if (props.clickable) return 'button'
  return 'div'
})

// Destination prop normalization: native <a> takes `href`, a RouterLink/
// NuxtLink component takes `to`. <button> takes a type instead.
const rootBindings = computed<Record<string, unknown>>(() => {
  if (props.href) {
    return typeof config.linkComponent === 'string'
      ? { href: props.href }
      : { to: props.href }
  }
  if (props.clickable) return { type: 'button' }
  return {}
})

const handleKunCardClick = (event: MouseEvent) => {
  if (isInteractive.value) onClick(event)
  // Emit unconditionally so plain `<KunCard @click="...">` works — the
  // declared emit means Vue stops auto-forwarding the native click.
  emit('click', event)
}

const colorClasses: Record<KunUIColor | 'background', string> = {
  background: 'bg-background',
  default: 'bg-default-100/30',
  primary: 'bg-primary-100/30 border-primary-300',
  secondary: 'bg-secondary-100/30 border-secondary-300',
  success: 'bg-success-100/30 border-success-300',
  warning: 'bg-warning-100/30 border-warning-300',
  danger: 'bg-danger-100/30 border-danger-300',
  info: 'bg-info-100/30 border-info-300',
}

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])
</script>

<template>
  <component
    :is="renderAs"
    v-bind="rootBindings"
    :class="
      cn(
        'relative flex flex-col gap-3 p-3 backdrop-blur-[var(--kun-background-blur)] transition-all duration-kun-fast',
        isHoverable && 'hover:bg-default-100',
        bordered && 'border-kun border',
        isInteractive && 'cursor-pointer overflow-hidden active:scale-[0.97] text-left',
        isTransparent ? 'backdrop-blur-none' : colorClasses[props.color],
        roundedClass,
        className
      )
    "
    @click="handleKunCardClick"
  >
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <div v-if="$slots.cover" class="w-full">
      <slot name="cover" />
    </div>

    <div :class="cn('flex h-full flex-col justify-between gap-1', contentClass)">
      <slot />
    </div>

    <!-- Footer: no separator line — just a section, spaced from the content by
         the card's own `gap-3` (matches the borderless header). -->
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>

    <KunRipple :ripples="ripples" />
  </component>
</template>
