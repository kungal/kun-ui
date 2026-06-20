<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'
const user: KunUser = { id: 1, name: 'Kun', avatar }
</script>

<template>
  <KunAvatar :user="user" :is-navigation="false" size="xs" />
  <KunAvatar :user="user" :is-navigation="false" size="sm" />
  <KunAvatar :user="user" :is-navigation="false" size="md" />
  <KunAvatar :user="user" :is-navigation="false" size="lg" />
  <KunAvatar :user="user" :is-navigation="false" size="xl" />
  <KunAvatar :user="user" :is-navigation="false" size="original-sm" />
  <KunAvatar :user="user" :is-navigation="false" size="original" />
</template>
