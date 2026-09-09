<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// No `avatar` URL → KunAvatar picks from `avatarFallbackPool`, hashed on the
// name, so the same unknown user always gets the same picture. The pool is HOST
// config: leave it unset and all three of these render the identical bundled
// fallback instead. This site configures it in app/plugins/kun-avatar-pool.ts.
const alice: KunUser = { id: 1, name: 'Alice', avatar: '' }
const bob: KunUser = { id: 2, name: 'Bob', avatar: '' }
const carol: KunUser = { id: 3, name: 'Carol', avatar: '' }
</script>

<template>
  <KunAvatar :user="alice" :is-navigation="false" size="lg" />
  <KunAvatar :user="bob" :is-navigation="false" size="lg" />
  <KunAvatar :user="carol" :is-navigation="false" size="lg" />
</template>
