<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// With `isNavigation` (the default) and a user that has an `id`, the avatar
// renders a real, crawlable link to the user's profile and scales on hover.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" size="lg" />
</template>
