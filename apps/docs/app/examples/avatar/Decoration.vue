<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = {
  id: 1,
  name: 'Kun',
  avatar: '/favicon.webp',
  avatarDecoration: {
    src: '/demo/decorations/sakura.png',
    animatedSrc: '/demo/decorations/sakura.webp',
  },
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" :is-navigation="false" />
      <span class="text-default-500 text-xs">hover</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" decoration="always" :is-navigation="false" />
      <span class="text-default-500 text-xs">always</span>
    </div>
    <div class="flex flex-col items-center gap-3">
      <KunAvatar :user="user" size="original-sm" decoration="static" :is-navigation="false" />
      <span class="text-default-500 text-xs">static</span>
    </div>
    <div class="flex items-center gap-4">
      <KunAvatar :user="user" size="sm" :is-navigation="false" />
      <KunAvatar :user="user" size="md" :is-navigation="false" />
      <KunAvatar :user="user" size="lg" :is-navigation="false" />
      <KunAvatar :user="user" size="xl" :is-navigation="false" />
    </div>
  </div>
</template>
