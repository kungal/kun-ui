<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const users: KunUser[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <!-- Only `visibleCount` avatars render; the rest collapse into a "+N" chip.
       Pass `total` to count members beyond the array you actually have. -->
  <KunAvatarGroup :users="users" :visible-count="4" :total="12" />
</template>
