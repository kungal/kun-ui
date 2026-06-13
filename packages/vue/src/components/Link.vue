<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunTextClasses } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunIcon from './Icon.vue'
import type { KunLinkProps } from './types'

// Nuxt-decoupled link. Renders `config.linkComponent` (native `<a>` by
// default; the Nuxt layer injects NuxtLink). Destination goes to `href`
// for a string tag or `to` for a component (RouterLink/NuxtLink).
defineOptions({ name: 'KunLink', inheritAttrs: false })

const props = withDefaults(defineProps<KunLinkProps>(), {
  to: '',
  href: undefined,
  color: 'primary',
  underline: 'always',
  size: 'md',
  className: '',
  rel: '',
  target: '_self',
  isShowAnchorIcon: false,
})

const config = useKunUIConfig()

const underlineClasses = computed(() => {
  switch (props.underline) {
    case 'none':
      return ''
    case 'hover':
      return 'hover:underline underline-offset-3'
    case 'always':
    default:
      return 'underline underline-offset-3'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs'
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-lg'
    case 'xl':
      return 'text-xl'
    case 'md':
    default:
      return 'text-base'
  }
})

const dest = computed(() => props.to || props.href || '')

// target="_blank" without rel="noopener" is a tabnabbing risk — auto-add it
// (merged with any caller-supplied rel). Modern browsers imply noopener, but
// being explicit covers older ones and is the documented best practice.
const computedRel = computed(() => {
  const parts = new Set((props.rel || '').split(/\s+/).filter(Boolean))
  if (props.target === '_blank') {
    parts.add('noopener')
    parts.add('noreferrer')
  }
  return parts.size ? [...parts].join(' ') : undefined
})

const linkBindings = computed<Record<string, unknown>>(() => {
  const common = { rel: computedRel.value, target: props.target }
  if (typeof config.linkComponent === 'string') {
    // native <a> takes a string href
    return {
      ...common,
      href: typeof dest.value === 'string' ? dest.value : undefined,
    }
  }
  // RouterLink / NuxtLink take `to`
  return { ...common, to: dest.value }
})
</script>

<template>
  <component
    :is="config.linkComponent"
    v-bind="{ ...linkBindings, ...$attrs }"
    :class="
      cn(
        'inline-flex items-center gap-2 break-all',
        underlineClasses,
        sizeClasses,
        kunTextClasses[color],
        className
      )
    "
  >
    <slot name="prefix" />
    <slot />
    <KunIcon v-if="isShowAnchorIcon" name="lucide:external-link" />
    <slot name="suffix" />
  </component>
</template>
