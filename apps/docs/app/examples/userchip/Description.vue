<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
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
