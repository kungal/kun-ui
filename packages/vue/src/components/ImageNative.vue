<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import type { KunImageNativeProps } from './types'

// A bare native <img> with class merging — for cases that don't want
// KunImage's skeleton/optimization machinery.
defineOptions({ name: 'KunImageNative' })

// Declared rather than left to attribute fallthrough. Fallthrough happens to
// work here (the root IS the <img>), but it made `@error` a property of this
// component's DOM shape instead of its API, and gave a signature that differs
// from KunImage's. Both now emit the same `(src, event)`.
const emit = defineEmits<{
  load: [src: string, event: Event]
  error: [src: string, event: Event]
}>()

withDefaults(defineProps<KunImageNativeProps>(), {
  alt: 'image',
  loading: 'lazy', // lazy by default; pass loading="eager" for an LCP image
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
    :loading="loading"
    :aria-label="ariaLabel"
    :width="width"
    :height="height"
    @load="(e: Event) => emit('load', src, e)"
    @error="(e: Event) => emit('error', src, e)"
  />
</template>
