<script setup lang="ts">
import { computed } from 'vue'
import { cn, getRandomSticker } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import KunImage from './Image.vue'
import type { KunAvatarProps } from './types'

// User avatar. Falls back to a deterministic sticker when there's no image,
// and navigates via config.navigate + config.userLinkTemplate on click
// (was a hardcoded `navigateTo('/user/:id/info')`).
defineOptions({ name: 'KunAvatar' })

const props = withDefaults(defineProps<KunAvatarProps>(), {
  size: 'md',
  isNavigation: true,
  className: '',
  imageClassName: '',
})

const config = useKunUIConfig()

const handleClickAvatar = async (event: MouseEvent) => {
  event.preventDefault()
  if (!props.isNavigation || !props.user?.id) return
  await config.navigate(
    config.userLinkTemplate.replace('{id}', String(props.user.id))
  )
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'original':
      return 'size-40'
    case 'original-sm':
      return 'size-24'
    case 'xs':
      return 'size-4'
    case 'sm':
      return 'size-6'
    case 'lg':
      return 'size-10'
    case 'xl':
      return 'size-12'
    case 'md':
    default:
      return 'size-8'
  }
})

const userAvatarSrc = computed(() => {
  const user = props.user
  if (user?.avatar) {
    return props.size === 'original' || props.size === 'original-sm'
      ? user.avatar
      : user.avatar.replace(/\.webp$/, '-100.webp')
  }
  // Deterministic per name so the same unknown user keeps the same sticker.
  return getRandomSticker(user?.name ?? '')
})
</script>

<template>
  <div
    :class="
      cn(
        'flex shrink-0 cursor-pointer justify-center rounded-full transition duration-150 ease-in-out hover:scale-110',
        sizeClasses,
        className
      )
    "
    @click="handleClickAvatar($event)"
  >
    <KunImage
      :class-name="cn('inline-block rounded-full', sizeClasses, props.imageClassName)"
      :src="userAvatarSrc"
      :alt="user?.name ?? '未知用户'"
    />
  </div>
</template>
