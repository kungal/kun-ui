<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import KunAvatar from './Avatar.vue'
import type { KunUserChipProps } from './types'

// Avatar + name (+ optional description). Degrades gracefully when `user`
// is null (unresolved brief). Named KunUserChip to avoid colliding with the
// KunUser data type.
defineOptions({ name: 'KunUserChip' })

const props = withDefaults(defineProps<KunUserChipProps>(), {
  size: 'md',
  description: '',
  className: '',
  disableFloating: false,
  floatingPosition: 'top',
})
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.className)">
    <KunAvatar
      :floating-position="props.floatingPosition"
      :disable-floating="props.disableFloating"
      :user="user"
      :size="size"
    />

    <div class="flex flex-col text-sm">
      <span>{{ user?.name || '未知用户' }}</span>
      <span v-if="description" class="text-default-500">{{ description }}</span>
    </div>
  </div>
</template>
