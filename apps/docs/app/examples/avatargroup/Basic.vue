<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const users: KunUser[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <KunAvatarGroup :users="users" />
</template>
