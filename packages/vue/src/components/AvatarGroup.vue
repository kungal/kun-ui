<script setup lang="ts">
import { computed } from 'vue'
import KunAvatar from './Avatar.vue'
import type { KunAvatarGroupProps } from './types'

// Overlapping/stacked avatars with an optional "+N" overflow chip.
defineOptions({ name: 'KunAvatarGroup' })

const props = withDefaults(defineProps<KunAvatarGroupProps>(), {
  ellipsis: true,
  visibleCount: 5,
  total: 0,
})

const users = computed(() =>
  props.ellipsis ? props.users.slice(0, props.visibleCount) : props.users
)
</script>

<template>
  <div class="flex flex-wrap items-center gap-1">
    <KunAvatar v-for="(user, index) in users" :key="index" :user="user" />

    <div
      v-if="props.total && props.total > props.visibleCount"
      class="bg-default-500/20 flex items-center justify-center rounded-full px-2 py-2 text-xs"
    >
      {{ `+ ${props.total - props.visibleCount}` }}
    </div>

    <slot />
  </div>
</template>
