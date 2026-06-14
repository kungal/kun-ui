<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/><circle cx="32" cy="26" r="11" fill="%23fff"/><rect x="14" y="42" width="36" height="16" rx="8" fill="%23fff"/></svg>'
)}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <!-- A secondary `description` line renders under the name in a muted color. -->
  <KunUserChip
    :user="user"
    description="2024 年加入 · 管理员"
    size="lg"
    :is-navigation="false"
  />
</template>
