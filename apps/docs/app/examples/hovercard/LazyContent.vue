<script setup lang="ts">
import { ref, watch } from 'vue'
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = { id: 7, name: 'KUN Galgame', avatar: '/kungalgame.webp' }

const open = ref(false)
const stats = ref<{ topics: number; followers: number } | null>(null)

// Fetch once, on the first open; the card shows a skeleton until it lands.
watch(open, async (isOpen) => {
  if (!isOpen || stats.value) return
  await new Promise((resolve) => setTimeout(resolve, 800))
  stats.value = { topics: 56, followers: 1024 }
})
</script>

<template>
  <KunHoverCard v-model:open="open">
    <template #trigger>
      <KunUserChip :user="user" description="悬停查看资料" />
    </template>

    <div class="w-56 space-y-2 p-4">
      <p class="font-semibold">{{ user.name }}</p>
      <template v-if="stats">
        <p class="text-default-600 text-sm">{{ stats.topics }} 个话题</p>
        <p class="text-default-600 text-sm">{{ stats.followers }} 位关注者</p>
      </template>
      <template v-else>
        <KunSkeleton variant="text" width="60%" />
        <KunSkeleton variant="text" width="40%" />
      </template>
    </div>
  </KunHoverCard>
</template>
