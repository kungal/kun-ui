<script setup lang="ts">
import { cn, kunVariantClasses, kunChipSizeClasses } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunChipProps } from './types'

// Small rounded tag — labels, status pills, taxonomy markers. Optional `start`
// / `end` slots (dot, avatar, icon) and a removable × (`closable`). For dot /
// count overlays use KunBadge.
defineOptions({ name: 'KunChip' })

const props = withDefaults(defineProps<KunChipProps>(), {
  color: 'default',
  className: '',
  size: 'sm',
  variant: 'flat',
  closable: false,
  disabled: false,
})

const emit = defineEmits<{
  close: []
}>()

</script>

<template>
  <span
    :class="
      cn(
        'inline-flex cursor-default items-center justify-center gap-1 rounded-full font-medium whitespace-nowrap',
        kunChipSizeClasses[props.size],
        kunVariantClasses(props.variant, props.color),
        disabled && 'pointer-events-none opacity-50',
        className
      )
    "
  >
    <slot name="start" />
    <slot />
    <button
      v-if="closable"
      type="button"
      class="-mr-0.5 ml-0.5 inline-flex shrink-0 items-center rounded-full opacity-70 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
      aria-label="移除"
      :disabled="disabled"
      @click.stop="emit('close')"
    >
      <KunIcon name="lucide:x" class="size-3.5" />
    </button>
    <slot name="end" />
  </span>
</template>
