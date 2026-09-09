<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { cn, pickAvatarFallback, KUN_AVATAR_FALLBACK } from '@kungal/ui-core'
import { useKunUIConfig } from '../config/useKunUIConfig'
import { warnEmptyAvatarPool } from '../utils/warnEmptyAvatarPool'
import KunImage from './Image.vue'
import type { KunAvatarProps } from './types'

// User avatar. Falls back to a deterministic pick from
// config.avatarFallbackPool when there's no image, and navigates via
// config.navigate + config.userLinkTemplate on click (was a hardcoded
// `navigateTo('/user/:id/info')`).
defineOptions({ name: 'KunAvatar' })

const props = withDefaults(defineProps<KunAvatarProps>(), {
  size: 'md',
  isNavigation: true,
  className: '',
  imageClassName: '',
})

const config = useKunUIConfig()

// Navigates to the user profile → render a real <a>/link (crawlable) when there
// is a user to link to. Otherwise a plain, non-interactive <div>.
const isLink = computed(() => props.isNavigation && !!props.user?.id)
const linkProps = computed(() => {
  if (!isLink.value) return {}
  const href = config.userLinkTemplate.replace('{id}', String(props.user?.id))
  return typeof config.linkComponent === 'string' ? { href } : { to: href }
})

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
  // KunAvatar renders the avatar URL exactly as given — it does NOT derive size
  // variants. Which URL to show (a pre-sized 100px thumbnail vs the original,
  // and the CDN's own variant convention like `<hash>_100.webp` vs
  // `avatar-100.webp`) is the consumer's concern: it knows its image host, so it
  // passes the resolved URL it wants. `size` here only sets the rendered
  // dimensions. Empty/missing avatar → a deterministic pick from the host's
  // pool, stable per name so the same unknown user always gets the same one.
  return props.user?.avatar || pickAvatarFallback(props.user?.name ?? '', config.avatarFallbackPool)
})

// A watcher, not a one-shot check in setup: `user` is commonly undefined on the
// first render and filled in when the request resolves, so a setup-time check
// would miss the very apps that need the warning.
if (process.env.NODE_ENV !== 'production') {
  watchEffect(() => {
    if (!props.user?.avatar && config.avatarFallbackPool.length === 0) {
      warnEmptyAvatarPool()
    }
  })
}
</script>

<template>
  <component
    :is="isLink ? config.linkComponent : 'div'"
    v-bind="linkProps"
    :class="
      cn(
        'flex shrink-0 justify-center rounded-full transition duration-kun-fast ease-kun-standard',
        isLink && 'cursor-pointer hover:scale-110',
        sizeClasses,
        className
      )
    "
  >
    <KunImage
      :class-name="cn('inline-block rounded-full', sizeClasses, props.imageClassName)"
      :src="userAvatarSrc"
      :fallback-src="KUN_AVATAR_FALLBACK"
      :alt="user?.name ?? '未知用户'"
    />
  </component>
</template>
