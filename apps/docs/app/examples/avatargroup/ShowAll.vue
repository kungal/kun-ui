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
  <!-- `ellipsis="false"` disables the "+N" chip and renders every avatar.
       `ariaLabel` overrides the default "N 位用户" group label for screen readers. -->
  <KunAvatarGroup :users="users" :ellipsis="false" aria-label="项目协作者" />
</template>
