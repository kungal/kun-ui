<script setup lang="ts">
import { cn, decodeIfEncoded } from '@kungal/ui-core'
import { useKunCopy } from '../composables/useKunCopy'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunCopyProps } from './types'

defineOptions({ name: 'KunCopy' })

withDefaults(defineProps<KunCopyProps>(), {
  name: '',
  variant: 'light',
  color: 'primary',
  size: 'md',
  // No `rounded` default: defer to the global config.rounded (default 'md').
  className: '',
})
</script>

<template>
  <KunButton
    :variant="variant"
    :color="color"
    :size="size"
    :rounded="rounded"
    :class-name="cn('gap-2', className)"
    @click="useKunCopy(text)"
  >
    <span>{{ decodeIfEncoded(name ? name : text) }}</span>
    <KunIcon name="lucide:copy" />
  </KunButton>
</template>
