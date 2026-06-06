<script setup lang="ts">
// Renders the current route's Chinese description (from site.config) as the
// page intro — so every component page's lead paragraph is translated from one
// place and stays in sync with the SEO meta.
import { computed } from 'vue'
import { useRoute } from '#imports'
import { pageMeta, site } from '~/site.config'

const route = useRoute()
const description = computed(
  () => pageMeta[route.path]?.description ?? site.description
)
</script>

<template>
  <p class="text-default-600 mt-3 text-lg">{{ description }}</p>
</template>
