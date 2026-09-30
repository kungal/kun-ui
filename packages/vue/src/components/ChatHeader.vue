<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@kungal/ui-core'
import KunAvatar from './Avatar.vue'
import KunIcon from './Icon.vue'
import KunChatTyping from './ChatTyping.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { useKunChatTyping } from '../composables/useKunChatTyping'
import { resolveKunChatUser, kunChatUserMap } from '../utils/chat'
import type { KunChatHeaderProps } from './types'

// The bar above a conversation: back (on a phone), avatar, title, and a
// second line that turns into "typing…" while someone types.
defineOptions({ name: 'KunChatHeader' })

const props = withDefaults(defineProps<KunChatHeaderProps>(), {
  title: undefined,
  user: null,
  avatar: null,
  kind: 'direct',
  subtitle: '',
  typing: () => [],
  users: () => [],
  back: 'mobile',
})

const emit = defineEmits<{
  /** The back button was clicked. */
  back: []
  /** The avatar or title was clicked, e.g. to open the profile or details. */
  'title-click': [event: MouseEvent]
}>()

defineSlots<{
  /** Buttons on the right: search, call, a menu. */
  actions?: () => unknown
  /** Replaces the second line when nobody is typing. */
  subtitle?: () => unknown
}>()

const { t } = useKunLocale()
const resolved = computed(() =>
  props.user ? resolveKunChatUser(kunChatUserMap([props.user]), props.user.id, t) : null
)
const name = computed(() => props.title ?? resolved.value?.name ?? '')
const avatarUser = computed(() => ({
  id: 0,
  name: resolved.value?.deleted ? '' : name.value,
  avatar: props.avatar ?? resolved.value?.avatar ?? '',
}))
const { active: typingActive } = useKunChatTyping(() => ({
  events: props.typing,
  users: props.users,
  kind: props.kind,
}))
</script>

<template>
  <header class="kun-chat-header bg-content1 border-default/20 flex h-14 shrink-0 items-center gap-1 border-b px-2">
    <button
      v-if="back"
      type="button"
      :class="
        cn(
          'text-default-600 hover:text-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-default/20',
          back === 'mobile' && 'kun-chat-header__back--mobile'
        )
      "
      :aria-label="t('chat.back')"
      @click="emit('back')"
    >
      <KunIcon name="lucide:arrow-left" class="text-xl" />
    </button>
    <button
      type="button"
      class="flex min-w-0 flex-1 items-center gap-3 rounded-kun-md px-1 py-1 text-left"
      @click="(e: MouseEvent) => emit('title-click', e)"
    >
      <KunAvatar :user="avatarUser" size="lg" :is-navigation="false" class="shrink-0" />
      <span class="flex min-w-0 flex-col">
        <span class="truncate leading-5 font-semibold">{{ name }}</span>
        <span class="text-foreground-muted truncate text-xs leading-4">
          <KunChatTyping v-if="typingActive" class="text-primary" :events="typing" :users="users" :kind="kind" />
          <slot v-else name="subtitle">{{ subtitle }}</slot>
        </span>
      </span>
    </button>
    <div class="flex shrink-0 items-center gap-1">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
/* `mobile` follows the KunChatLayout it sits in (its own width, 48rem), and
   the window outside one. The container rules come second so they win where
   both match: a narrow chat in a wide window keeps its back button. */
@media (width >= 48rem) {
  .kun-chat-header__back--mobile {
    display: none;
  }
}
@container kun-chat (width < 48rem) {
  .kun-chat-header__back--mobile {
    display: flex;
  }
}
@container kun-chat (width >= 48rem) {
  .kun-chat-header__back--mobile {
    display: none;
  }
}
</style>
