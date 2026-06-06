<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%237c3aed"/></svg>'
)}`
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunUserChip :user="user" description="Member since 2024" :disable-floating="true" />
</template>
