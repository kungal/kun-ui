<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/><circle cx="32" cy="26" r="11" fill="%23fff"/><rect x="14" y="42" width="36" height="16" rx="8" fill="%23fff"/></svg>'
)}`

// With `isNavigation` (the default) and a user that has an `id`, the WHOLE chip
// becomes one crawlable link to the profile, with the name as anchor text.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" description="点击进入个人主页" />
</template>
