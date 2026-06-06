<script setup lang="ts">
import { useKunLoliState } from '../composables/useKunLoliInfo'
import KunLoli from './Loli.vue'

// The single mounted host for useKunLoliInfo() popups. Mount once near your
// app root: <KunLoliProvider />. The store re-keys KunLoli per call so the
// enter animation replays, and removes it after the leave window.
defineOptions({ name: 'KunLoliProvider' })

const { current } = useKunLoliState()
</script>

<template>
  <KunLoli
    v-if="current"
    :key="current.key"
    :message="current.message"
    :duration="current.duration"
  />
</template>
