<script setup lang="ts">
import { computed } from 'vue'
import { cn, getKunIcon } from '@kungal/core'
import { useKunUIConfig } from '../config/useKunUIConfig'

// KunIcon renders ONLY from the bundled/registered icon registry (inline SVG)
// or a consumer-injected component. It NEVER fetches from the Iconify API —
// runtime fetching causes FOUC, SSR-empty-then-pop, offline/firewall
// failures, and latency. KunUI's own icons are bundled in @kungal/core;
// consumers register theirs with registerKunIcons() or inject `iconComponent`
// (e.g. @nuxt/icon in local-bundle mode). Public API (`name`) is unchanged.
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
  cn('inline-block shrink-0 text-inherit', props.class, props.className)
)

// Bundled / consumer-registered icon data (inline SVG, no fetch).
const data = computed(() => (props.name ? getKunIcon(props.name) : undefined))
</script>

<template>
  <!-- 1. Bundled / registered → inline SVG. Bodies use currentColor, so
       text-* classes set the color. Decorative by default. -->
  <svg
    v-if="data"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${data.width ?? 24} ${data.height ?? 24}`"
    :class="classes"
    aria-hidden="true"
    v-html="data.body"
  />

  <!-- 2. Not in the registry → defer to a consumer-injected renderer
       (e.g. @nuxt/icon local bundle, unplugin-icons). Still no KunUI fetch. -->
  <component
    :is="config.iconComponent"
    v-else-if="name && config.iconComponent"
    :name="name"
    :class="classes"
  />

  <!-- 3. Otherwise render nothing — never fetch. -->
</template>
