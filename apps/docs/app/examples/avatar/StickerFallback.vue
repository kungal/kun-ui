<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// No `avatar` URL → KunAvatar falls back to a deterministic sticker, stable per
// name, so the same unknown user always gets the same picture.
const alice: KunUser = { id: 1, name: 'Alice', avatar: '' }
const bob: KunUser = { id: 2, name: 'Bob', avatar: '' }
const carol: KunUser = { id: 3, name: 'Carol', avatar: '' }
</script>

<template>
  <KunAvatar :user="alice" :is-navigation="false" size="lg" />
  <KunAvatar :user="bob" :is-navigation="false" size="lg" />
  <KunAvatar :user="carol" :is-navigation="false" size="lg" />
</template>
