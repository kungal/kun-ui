<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import type { KunImageNativeProps } from './types'

// A bare native <img> with class merging — for cases that don't want
// KunImage's skeleton/optimization machinery.
defineOptions({ name: 'KunImageNative' })

withDefaults(defineProps<KunImageNativeProps>(), {
  alt: 'image',
  className: undefined,
  ariaLabel: undefined,
  width: undefined,
  height: undefined,
})
</script>

<template>
  <img
    :class="cn(className)"
    :src="src"
    :alt="alt"
    :aria-label="ariaLabel"
    :width="width"
    :height="height"
  />
</template>
