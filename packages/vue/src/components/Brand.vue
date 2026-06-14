<script setup lang="ts">
import { computed } from 'vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunImage from './Image.vue'
import KunChip from './Chip.vue'
import type { KunBrandProps } from './types'

// Home-link header: logo + name + optional badge. Renders a real <a> / link
// (config.linkComponent) so the home link is crawlable, not a div @click.
defineOptions({ name: 'KunBrand' })

const props = withDefaults(defineProps<KunBrandProps>(), {
  iconSrc: '/favicon.webp',
  iconAlt: 'logo',
  iconClass: 'size-10 rounded-kun-lg',
  badge: '',
  badgeColor: 'primary',
  to: '/',
  nameClass: 'text-xl',
})

const config = useKunUIConfig()
const linkProps = computed(() =>
  typeof config.linkComponent === 'string'
    ? { href: props.to }
    : { to: props.to }
)
</script>

<template>
  <component
    :is="config.linkComponent"
    v-bind="linkProps"
    class="flex cursor-pointer items-center gap-3 text-inherit no-underline"
  >
    <KunImage :class-name="iconClass" :src="iconSrc" :alt="iconAlt" />
    <span :class="nameClass">{{ name }}</span>
    <KunChip v-if="badge" size="md" :color="badgeColor">{{ badge }}</KunChip>
  </component>
</template>
