<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// Any image URL works — a local/public asset (here the site icon), a remote CDN
// image, or the deterministic sticker fallback when `avatar` is omitted.
const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" />
</template>
