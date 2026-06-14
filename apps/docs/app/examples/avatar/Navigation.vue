<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/><circle cx="32" cy="26" r="11" fill="%23fff"/><rect x="14" y="42" width="36" height="16" rx="8" fill="%23fff"/></svg>'
)}`

// With `isNavigation` (the default) and a user that has an `id`, the avatar
// renders a real, crawlable link to the user's profile and scales on hover.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" size="lg" />
</template>
