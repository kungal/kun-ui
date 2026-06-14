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
  <!-- `ellipsis="false"` disables the "+N" chip and renders every avatar.
       `ariaLabel` overrides the default "N 位用户" group label for screen readers. -->
  <KunAvatarGroup :users="users" :ellipsis="false" aria-label="项目协作者" />
</template>
