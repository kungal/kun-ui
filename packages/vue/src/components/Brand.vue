<script setup lang="ts">
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunImage from './Image.vue'
import KunChip from './Chip.vue'
import type { KunBrandProps } from './types'

// Home-link header: logo + name + optional badge. All values come from
// props so it's app-neutral. Navigates via config.navigate (was navigateTo).
defineOptions({ name: 'KunBrand' })

const props = withDefaults(defineProps<KunBrandProps>(), {
  iconSrc: '/favicon.webp',
  iconAlt: 'logo',
  iconClass: 'size-10 rounded-2xl',
  badge: '',
  badgeColor: 'primary',
  to: '/',
  nameClass: 'text-xl',
})

const config = useKunUIConfig()
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-3"
    @click="config.navigate(props.to)"
  >
    <KunImage :class-name="iconClass" :src="iconSrc" :alt="iconAlt" />
    <span :class="nameClass">{{ name }}</span>
    <KunChip v-if="badge" size="md" :color="badgeColor">{{ badge }}</KunChip>
  </div>
</template>
