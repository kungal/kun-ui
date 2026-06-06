<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@kungal/core'
import type { KunHeaderProps } from './types'

// Page/section heading with title + description + slots. No coupling.
defineOptions({ name: 'KunHeader' })

const props = withDefaults(defineProps<KunHeaderProps>(), {
  name: '',
  description: '',
  scale: 'h1',
})

const headingClass = computed(() => {
  const scaleClasses = {
    h1: 'text-2xl sm:text-3xl',
    h2: 'text-xl sm:text-2xl',
    h3: 'text-lg sm:text-xl',
  }
  return cn('font-medium', scaleClasses[props.scale])
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="space-y-2">
        <component :is="scale" :title="name" :class="headingClass">
          <span v-if="name">{{ name }}</span>
          <slot name="title" />
        </component>

        <p
          v-if="description"
          class="text-default-500 text-sm whitespace-pre-wrap sm:text-base"
        >
          {{ description }}
        </p>
        <slot name="description" />
      </div>
      <slot name="headerEndContent" />
    </div>
    <slot name="endContent" />
  </div>
</template>
