<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { cn } from '@kungal/core'
import { useKunUIConfig } from '../config/useKunUIConfig'

// KunIcon's public API is unchanged from the Nuxt version: every component
// calls `<KunIcon name="lucide:x" />`. Internally it is decoupled:
//   - if the host injected `iconComponent` (e.g. @nuxt/icon via @kungal/ui-nuxt)
//     → render it, forwarding `name` (the @nuxt/icon convention).
//   - otherwise → render @iconify/vue, which takes `icon`. Same Iconify
//     names, so call sites don't change.
defineOptions({ name: 'KunIcon' })

const props = withDefaults(
  defineProps<{
    name?: string
    class?: string
    className?: string
  }>(),
  {
    name: '',
    class: '',
    className: '',
  }
)

const config = useKunUIConfig()
const classes = computed(() =>
  cn('shrink-0 text-inherit', props.class, props.className)
)
</script>

<template>
  <component
    v-if="props.name && config.iconComponent"
    :is="config.iconComponent"
    :name="props.name"
    :class="classes"
  />
  <IconifyIcon
    v-else-if="props.name"
    :icon="props.name"
    :class="classes"
  />
</template>

<style scoped>
:deep(path),
:deep(ellipse),
:deep(g),
:deep(rect),
:deep(circle) {
  color: inherit;
}
</style>
