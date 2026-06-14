<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/><circle cx="32" cy="26" r="11" fill="%23fff"/><rect x="14" y="42" width="36" height="16" rx="8" fill="%23fff"/></svg>'
)}`
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
