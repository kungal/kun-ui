<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/></svg>'
)}`
const users: KunUser[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <KunAvatarGroup :users="users" :total="8" />
</template>
