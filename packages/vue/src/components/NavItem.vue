<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunNavItemProps } from './types'

defineOptions({ name: 'KunNavItem' })

const props = withDefaults(defineProps<KunNavItemProps>(), {
  icon: '',
  href: '',
  current: false,
  stacked: false,
  color: 'primary',
  disabled: false,
  className: '',
})

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <KunButton
    :variant="current ? 'flat' : 'light'"
    :color="current ? color : 'default'"
    :href="href"
    :disabled="disabled"
    full-width
    :aria-current="current ? 'page' : undefined"
    :class-name="cn(stacked ? 'flex-col gap-1' : 'justify-start gap-2', props.className)"
    @click="emits('click', $event)"
  >
    <span
      v-if="$slots.icon || icon"
      class="flex shrink-0 items-center justify-center"
    >
      <slot name="icon">
        <KunIcon :name="icon" :class-name="stacked ? 'size-5' : 'size-4'" />
      </slot>
    </span>
    <span :class="stacked ? 'text-xs' : ''">{{ label }}</span>
  </KunButton>
</template>
