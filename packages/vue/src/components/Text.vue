<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@kungal/ui-core'
import type { KunTextProps } from './types'

// Plain-text block with safe wrapping. Inserts a zero-width space after `_`
// and `/` so long tokens (URLs, snake_case) wrap instead of overflowing.
defineOptions({ name: 'KunText' })

const props = withDefaults(defineProps<KunTextProps>(), {
  content: '',
  className: '',
})

const processedText = computed(() => props.content.replace(/([_/])/g, '$1​'))
</script>

<template>
  <span :class="cn('kun-text-block', props.className)">
    {{ processedText }}
  </span>
</template>

<style scoped>
.kun-text-block {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>
