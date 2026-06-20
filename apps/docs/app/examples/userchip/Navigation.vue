<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// With `isNavigation` (the default) and a user that has an `id`, the WHOLE chip
// becomes one crawlable link to the profile, with the name as anchor text.
const user: KunUser = { id: 42, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" description="点击进入个人主页" />
</template>
