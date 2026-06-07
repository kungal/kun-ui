<script setup lang="ts">
// Renders the page H1 as "Title (中文)" from site.config — one source for the
// English API name + its Chinese name, shared with the nav and <title>.
import { computed } from 'vue'
import { useRoute } from '#imports'
import { displayLabel } from '~/site.config'

const route = useRoute()
const label = computed(() => displayLabel(route.path))
</script>

<template>
  <h1 class="text-3xl font-bold tracking-tight">{{ label }}</h1>
</template>
