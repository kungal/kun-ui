<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunAvatar from './Avatar.vue'
import type { KunUserChipProps } from './types'

// Avatar + name (+ optional description). When the user has an id and
// isNavigation (default), the WHOLE chip is one real <a>/link to the profile
// (crawlable, name as anchor text); the inner avatar then isn't a nested link.
defineOptions({ name: 'KunUserChip' })

const props = withDefaults(defineProps<KunUserChipProps>(), {
  size: 'md',
  description: '',
  className: '',
  isNavigation: true,
  disableFloating: false,
  floatingPosition: 'top',
})

const config = useKunUIConfig()
const isLink = computed(() => props.isNavigation && !!props.user?.id)
const linkProps = computed(() => {
  if (!isLink.value) return {}
  const href = config.userLinkTemplate.replace('{id}', String(props.user?.id))
  return typeof config.linkComponent === 'string' ? { href } : { to: href }
})
</script>

<template>
  <component
    :is="isLink ? config.linkComponent : 'div'"
    v-bind="linkProps"
    :class="
      cn(
        'flex items-center gap-2 text-inherit no-underline',
        isLink && 'cursor-pointer',
        props.className
      )
    "
  >
    <KunAvatar
      :floating-position="props.floatingPosition"
      :disable-floating="props.disableFloating"
      :user="user"
      :size="size"
      :is-navigation="false"
    />

    <div class="flex flex-col text-sm">
      <span>{{ user?.name || '未知用户' }}</span>
      <span v-if="description" class="text-default-500">{{ description }}</span>
    </div>
  </component>
</template>
