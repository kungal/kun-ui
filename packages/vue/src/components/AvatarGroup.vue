<script setup lang="ts">
import { computed } from 'vue'
import KunAvatar from './Avatar.vue'
import type { KunAvatarGroupProps } from './types'

// Overlapping/stacked avatars with an optional "+N" overflow chip.
defineOptions({ name: 'KunAvatarGroup' })

const props = withDefaults(defineProps<KunAvatarGroupProps>(), {
  ellipsis: true,
  visibleCount: 5,
  total: undefined,
  ariaLabel: undefined,
})

const visibleUsers = computed(() =>
  props.ellipsis ? props.users.slice(0, props.visibleCount) : props.users
)

// Overflow derives from `total` when given, else the actual user count — so a
// list longer than visibleCount shows "+N" without passing total explicitly.
const grandTotal = computed(() => props.total ?? props.users.length)
const overflow = computed(() =>
  props.ellipsis ? Math.max(0, grandTotal.value - props.visibleCount) : 0
)

const groupLabel = computed(
  () => props.ariaLabel ?? `${grandTotal.value} 位用户`
)
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-1"
    role="group"
    :aria-label="groupLabel"
  >
    <KunAvatar
      v-for="(user, index) in visibleUsers"
      :key="user.id ?? index"
      :user="user"
    />

    <div
      v-if="overflow > 0"
      class="bg-default-500/20 flex items-center justify-center rounded-full px-2 py-2 text-xs"
    >
      {{ `+ ${overflow}` }}
    </div>

    <slot />
  </div>
</template>
