<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

// Offline data-URI avatar (doesn't end in .webp, so KunAvatar uses it as-is).
const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#7c3aed"/><circle cx="40" cy="32" r="14" fill="#fff"/><rect x="18" y="52" width="44" height="20" rx="10" fill="#fff"/></svg>'
)}`

const user: KunUser = { id: 1, name: 'Kun', avatar }
const users: KunUser[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  avatar,
}))
</script>

<template>
  <section class="flex flex-col gap-4">
    <KunHeader name="People" description="Avatar · AvatarGroup · UserChip" scale="h2" />

    <h3 class="text-base font-medium">Avatar sizes (click disabled in demo)</h3>
    <div class="flex items-center gap-4">
      <KunAvatar :user="user" size="xs" :is-navigation="false" />
      <KunAvatar :user="user" size="sm" :is-navigation="false" />
      <KunAvatar :user="user" size="md" :is-navigation="false" />
      <KunAvatar :user="user" size="lg" :is-navigation="false" />
      <KunAvatar :user="user" size="xl" :is-navigation="false" />
      <KunAvatar :user="null" size="lg" :is-navigation="false" />
    </div>

    <h3 class="text-base font-medium">AvatarGroup (+overflow)</h3>
    <KunAvatarGroup :users="users" :total="12" :visible-count="4" />

    <h3 class="text-base font-medium">UserChip</h3>
    <KunUserChip :user="user" description="Member since 2024" />
  </section>
</template>
