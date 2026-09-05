<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunRoundedClasses, type KunUIColor } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useRipple } from '../composables/useRipple'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunRipple from './Ripple.vue'
import type { KunCardProps, KunCardPadding } from './types'

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
  padding: 'lg',
  className: '',
  contentClass: '',
  rounded: undefined,
  color: 'background',
  darkBorder: false,
})

const emit = defineEmits<{
  /**
   * The card's native click. Emitted in all three render modes (div / button /
   * link), so a plain `<KunCard @click>` works.
   */
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

// A card is a RAISED surface: `content1` (the elevated fill) over the softer page
// background, plus a small shadow — so it reads as a card without a border. The
// colored variants stay as tints. Pass `bordered` to add an optional outline.
const colorClasses: Record<KunUIColor | 'background', string> = {
  background: 'bg-content1',
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

// Inner padding. `lg` (24px) is the default — comfortable, matching shadcn / Ant /
// KunModal; `sm` (12px) is the old compact value, `none` for full-bleed cards.
const paddingClasses: Record<KunCardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

// Hover = a faint `foreground` state layer (via ::after) — darkens slightly in
// light, lightens slightly in dark. The page sits ~7% below white, which leaves
// room for this ~3% tint to read as a hover while the card stays clearly brighter
// than the page. No shadow change. Kept here (not inline in the template) so the
// `content-['']` quotes don't clash with the :class="" attr.
const hoverStateLayer =
  "after:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-foreground after:opacity-0 after:transition-opacity after:duration-kun-fast hover:after:opacity-[0.03]"
</script>

<template>
  <component
    :is="renderAs"
    v-bind="rootBindings"
    :class="
      cn(
        'relative flex flex-col gap-4 transition-all duration-kun-fast',
        paddingClasses[padding],
        // A raised (opaque) card: shadow + an opt-in glass backdrop (free `none`
        // by default — no backdrop-filter is emitted unless --kun-backdrop-filter
        // is set). Transparent cards stay fully see-through with neither.
        !isTransparent && 'shadow-kun-sm kun-backdrop',
        // Hover feedback only for navigable/clickable cards or an explicit opt-in;
        // a plain static card stays inert.
        (isInteractive || isHoverable) && hoverStateLayer,
        bordered && 'border-kun border',
        isInteractive && 'cursor-pointer overflow-hidden active:scale-[0.97] text-left',
        !isTransparent && colorClasses[props.color],
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
