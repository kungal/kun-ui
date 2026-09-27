<script setup lang="ts">
import { computed } from 'vue'
import type { KunUIColor, KunUIVariant } from '@kungal/ui-core'
import KunButton from './Button.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { kunChatUserMap, resolveKunChatUser } from '../utils/chat'
import type { KunChatRequestAction, KunChatRequestBarProps } from './types'

// The bar on top of a message request — a conversation from someone outside
// the viewer's inbox rule: accept, delete (the sender is not told), block,
// report. Telegram's bar for a new contact, with accept added.
defineOptions({ name: 'KunChatRequestBar' })

const props = withDefaults(defineProps<KunChatRequestBarProps>(), {
  user: null,
  actions: () => ['accept', 'delete', 'block', 'report'],
  loading: null,
})

const emit = defineEmits<{
  /** Move the conversation into the inbox. */
  accept: []
  /** Delete the conversation; the sender is not told. */
  delete: []
  block: []
  report: []
}>()

const { t } = useKunLocale()
const name = computed(() =>
  props.user ? resolveKunChatUser(kunChatUserMap([props.user]), props.user.id, t).name : ''
)

const LOOK: Record<KunChatRequestAction, { variant: KunUIVariant; color: KunUIColor }> = {
  accept: { variant: 'solid', color: 'primary' },
  delete: { variant: 'flat', color: 'default' },
  block: { variant: 'flat', color: 'danger' },
  report: { variant: 'light', color: 'danger' },
}
const run = (action: KunChatRequestAction) => {
  if (action === 'accept') emit('accept')
  else if (action === 'delete') emit('delete')
  else if (action === 'block') emit('block')
  else emit('report')
}
</script>

<template>
  <div
    class="kun-chat-request-bar bg-content1 border-default/20 flex flex-col items-center gap-2 border-b px-4 py-3 text-center"
    role="region"
    :aria-label="t('chatRequest.title')"
  >
    <p class="text-sm font-semibold">{{ t('chatRequest.title') }}</p>
    <p class="text-default-600 max-w-md text-sm">{{ t('chatRequest.description', { name }) }}</p>
    <div class="flex flex-wrap justify-center gap-2">
      <KunButton
        v-for="action in actions"
        :key="action"
        size="sm"
        :variant="LOOK[action].variant"
        :color="LOOK[action].color"
        :loading="loading === action"
        :disabled="!!loading && loading !== action"
        @click="run(action)"
      >
        {{ t(`chatRequest.${action}`) }}
      </KunButton>
    </div>
  </div>
</template>
