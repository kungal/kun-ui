<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// A bundled data-URI avatar (no network request for the demo).
const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#7c3aed"/></svg>'
)}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" size="sm" />
  <KunAvatar :user="user" :is-navigation="false" size="md" />
  <KunAvatar :user="user" :is-navigation="false" size="lg" />
</template>
