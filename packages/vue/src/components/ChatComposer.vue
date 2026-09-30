<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  cn,
  formatKunChatMarkdown,
  parseKunChatMarkdown,
  KUN_CHAT_TYPING_INTERVAL,
  type KunChatFormattedText,
  type KunChatMessage,
  type KunChatReplyQuote,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import KunChatText from './ChatText.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { isImeComposing } from '../utils/imeComposition'
import { isKunCoarsePointer } from '../composables/useKunSwipeDismiss'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { kunChatMediaLabel, kunChatUserMap, resolveKunChatUser } from '../utils/chat'
import type { KunChatComposerProps } from './types'

// The message input. It is a plain textarea holding the composer shortcuts
// (**bold**, ||spoiler||, …): `send` carries them parsed into text + entities,
// and editing a sent message formats it back — the same pair of ui-core
// functions the Flutter port uses, so a draft round-trips across platforms.
defineOptions({ name: 'KunChatComposer' })

const props = withDefaults(defineProps<KunChatComposerProps>(), {
  placeholder: undefined,
  disabled: false,
  disabledText: '',
  enterToSend: 'auto',
  maxLength: 4096,
  attachments: () => [],
  accept: 'image/*',
  users: () => [],
  maxRows: 8,
})

/** The input as typed, shortcuts included. Keep a draft as
 *  `parseKunChatMarkdown(value)` and restore it with `formatKunChatMarkdown`. */
const model = defineModel<string>({ default: '' })
/** The message being replied to; the bar above the input shows it. Cleared
 *  on send and on cancel. */
const replyTo = defineModel<KunChatMessage | null>('replyTo', { default: null })
/** The quoted part of `replyTo`, from the message menu's `quote`. */
const quote = defineModel<KunChatReplyQuote | null>('quote', { default: null })
/** The message being edited. Setting it puts the message in the input (the
 *  draft is kept aside and comes back when editing ends); `edit` fires
 *  instead of `send`. */
const editing = defineModel<KunChatMessage | null>('editing', { default: null })

const emit = defineEmits<{
  /** Send a new message. The input is cleared and the reply consumed. */
  send: [message: KunChatFormattedText]
  /** Save an edit of `target`. Editing ends and the draft comes back. */
  edit: [message: KunChatFormattedText, target: KunChatMessage]
  /** Files were picked, pasted or dropped: upload them and list them in
   *  `attachments`. */
  attach: [files: File[]]
  /** The × of an attachment was clicked. */
  'remove-attachment': [key: string]
  /** A failed attachment (`error`) was clicked: upload it again. */
  'retry-attachment': [key: string]
  /** The user is typing: at most once per 5 s, never while editing. Send the
   *  typing notification. */
  typing: []
  /** ↑ in an empty input: start editing your last message, as Telegram
   *  Desktop does. */
  'edit-last': []
}>()

defineSlots<{
  /** Before the input, after the attach button, e.g. an emoji button. */
  prefix?: () => unknown
  /** After the input, before the send button. */
  suffix?: () => unknown
}>()

const { t } = useKunLocale()
const textarea = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const resize = () => {
  const el = textarea.value
  if (!el) return
  const style = getComputedStyle(el)
  const line = parseFloat(style.lineHeight) || 24
  const pad = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
  el.style.height = 'auto'
  const max = line * props.maxRows + pad
  el.style.height = `${Math.min(el.scrollHeight, max)}px`
  el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
}
watch(model, () => nextTick(resize))
onMounted(() => requestAnimationFrame(resize))

// Counted on the parsed text, as the server counts it. The source is never
// shorter than the text, so short input skips the parse.
const COUNTER_FROM = 200
const length = computed(() =>
  model.value.length <= props.maxLength - COUNTER_FROM
    ? model.value.length
    : parseKunChatMarkdown(model.value.trim()).text.length
)
const remaining = computed(() => props.maxLength - length.value)
const showCounter = computed(() => remaining.value <= COUNTER_FROM)
// The input is described by the counter rather than the counter being a
// live region: a live region read out a bare number on every keystroke.
const counterId = useKunUniqueId('kun-chat-counter')

const canSend = computed(
  () =>
    !props.disabled &&
    remaining.value >= 0 &&
    (model.value.trim().length > 0 || (!editing.value && props.attachments.length > 0))
)

const users = computed(() => kunChatUserMap(props.users))
const bar = computed(() => {
  if (editing.value) {
    return { icon: 'lucide:pencil', title: t('chatComposer.editing'), message: editing.value }
  }
  if (replyTo.value) {
    const name = resolveKunChatUser(users.value, replyTo.value.sender_id, t).name
    return {
      icon: quote.value ? 'lucide:quote' : 'lucide:reply',
      title: quote.value ? t('chatComposer.quoteFrom', { name }) : t('chatComposer.replyTo', { name }),
      message: replyTo.value,
    }
  }
  return null
})

const cancelBar = () => {
  if (editing.value) {
    editing.value = null
  } else {
    replyTo.value = null
    quote.value = null
  }
  textarea.value?.focus()
}

// Entering edit mode stashes the draft; leaving it brings the draft back.
let stash: string | null = null
watch(editing, (next, prev) => {
  if (next && next !== prev) {
    if (stash === null) stash = model.value
    model.value = formatKunChatMarkdown(next.text, next.entities)
    nextTick(() => {
      const el = textarea.value
      if (!el) return
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    })
  } else if (!next && stash !== null) {
    model.value = stash
    stash = null
  }
})
// The reply bar grabs the input, so the reply can be typed straight away.
watch(replyTo, (next) => next && nextTick(() => textarea.value?.focus()))

const submit = () => {
  if (!canSend.value) return
  const message = parseKunChatMarkdown(model.value.trim())
  if (editing.value) {
    const target = editing.value
    emit('edit', message, target)
    editing.value = null
  } else {
    emit('send', message)
    model.value = ''
    replyTo.value = null
    quote.value = null
  }
  nextTick(() => textarea.value?.focus())
}

const sendsOnEnter = () =>
  props.enterToSend === 'auto' ? !isKunCoarsePointer() : props.enterToSend

const onKeydown = (event: KeyboardEvent) => {
  if (isImeComposing(event)) return
  if (event.key === 'Enter') {
    const send = sendsOnEnter() ? !event.shiftKey : event.ctrlKey || event.metaKey
    if (send) {
      event.preventDefault()
      submit()
    }
  } else if (event.key === 'Escape' && bar.value) {
    event.preventDefault()
    cancelBar()
  } else if (event.key === 'ArrowUp' && !model.value && !editing.value) {
    event.preventDefault()
    emit('edit-last')
  }
}

let lastTyping = 0
const onInput = () => {
  if (editing.value) return
  const now = Date.now()
  if (model.value && now - lastTyping >= KUN_CHAT_TYPING_INTERVAL) {
    lastTyping = now
    emit('typing')
  }
}

const attach = (files: FileList | File[] | null | undefined) => {
  const list = Array.from(files ?? [])
  if (list.length) emit('attach', list)
}
const onPaste = (event: ClipboardEvent) => {
  const files = event.clipboardData?.files
  if (files?.length) {
    event.preventDefault()
    attach(files)
  }
}
const onPick = () => {
  attach(fileInput.value?.files)
  if (fileInput.value) fileInput.value.value = ''
}

const dragging = ref(false)
let dragDepth = 0
const hasFiles = (event: DragEvent) => !!event.dataTransfer?.types.includes('Files')
const onDragEnter = (event: DragEvent) => {
  if (!hasFiles(event) || props.disabled) return
  event.preventDefault()
  dragDepth++
  dragging.value = true
}
const onDragOver = (event: DragEvent) => {
  if (hasFiles(event) && !props.disabled) event.preventDefault()
}
const onDragLeave = () => {
  dragDepth = Math.max(0, dragDepth - 1)
  if (!dragDepth) dragging.value = false
}
const onDrop = (event: DragEvent) => {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  dragging.value = false
  attach(event.dataTransfer?.files)
}

defineExpose({
  focus: () => textarea.value?.focus(),
  /** Insert text at the caret, e.g. an emoji from a picker. */
  insertText: (text: string) => {
    const el = textarea.value
    const start = el?.selectionStart ?? model.value.length
    const end = el?.selectionEnd ?? model.value.length
    model.value = model.value.slice(0, start) + text + model.value.slice(end)
    nextTick(() => {
      el?.focus()
      el?.setSelectionRange(start + text.length, start + text.length)
    })
  },
})
</script>

<template>
  <div
    class="kun-chat-composer bg-content1 border-default/20 relative border-t px-2 py-2"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div v-if="bar" class="flex items-center gap-2 px-1 pb-2">
      <KunIcon :name="bar.icon" class="text-primary shrink-0 text-xl" />
      <div class="border-primary min-w-0 flex-1 border-l-2 pl-2">
        <div class="text-primary truncate text-sm font-semibold">{{ bar.title }}</div>
        <div class="text-default-600 truncate text-sm [:where(&)_*]:text-inherit">
          <KunChatText
            v-if="quote && !editing ? quote.text : bar.message.text"
            :text="quote && !editing ? quote.text : bar.message.text"
            :entities="quote && !editing ? quote.entities : bar.message.entities"
            preview
          />
          <span v-else>{{ kunChatMediaLabel(bar.message.media, t) }}</span>
        </div>
      </div>
      <button
        type="button"
        class="text-default-500 hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-default/20"
        :aria-label="editing ? t('chatComposer.cancelEdit') : t('chatComposer.cancelReply')"
        @click="cancelBar"
      >
        <KunIcon name="lucide:x" />
      </button>
    </div>

    <div v-if="attachments.length" class="flex gap-2 overflow-x-auto px-1 pb-2">
      <div
        v-for="a in attachments"
        :key="a.key"
        class="bg-default/20 relative size-16 shrink-0 overflow-hidden rounded-kun-md"
      >
        <img v-if="a.url" :src="a.url" :alt="a.name ?? ''" class="size-full object-cover" />
        <span
          v-if="a.progress !== undefined && a.progress < 1 && !a.error"
          class="absolute inset-x-1 bottom-1 h-1 overflow-hidden rounded-full bg-black/30"
        >
          <span class="bg-primary block h-full origin-left" :style="{ transform: `scaleX(${a.progress})` }" />
        </span>
        <button
          v-if="a.error"
          type="button"
          class="absolute inset-0 flex items-center justify-center bg-black/45 text-white"
          :aria-label="t('chatComposer.retryAttachment')"
          :title="t('chatComposer.retryAttachment')"
          @click="emit('retry-attachment', a.key)"
        >
          <KunIcon name="lucide:rotate-cw" class="text-xl" />
        </button>
        <button
          type="button"
          class="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-black/55 text-white"
          :aria-label="t('chatComposer.removeAttachment')"
          @click="emit('remove-attachment', a.key)"
        >
          <KunIcon name="lucide:x" class="text-xs" />
        </button>
      </div>
    </div>

    <div v-if="disabled" class="text-foreground-muted px-3 py-2.5 text-center text-sm">
      {{ disabledText }}
    </div>
    <div v-else class="flex items-end gap-1">
      <button
        v-if="!editing"
        type="button"
        class="text-default-500 hover:text-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-default/20"
        :aria-label="t('chatComposer.attach')"
        @click="fileInput?.click()"
      >
        <KunIcon name="lucide:paperclip" class="text-xl" />
      </button>
      <input
        ref="fileInput"
        type="file"
        :style="{ display: 'none' }"
        multiple
        :accept="accept"
        tabindex="-1"
        aria-hidden="true"
        @change="onPick"
      />
      <slot name="prefix" />
      <textarea
        ref="textarea"
        v-model="model"
        rows="1"
        :placeholder="placeholder ?? t('chatComposer.placeholder')"
        :aria-label="placeholder ?? t('chatComposer.placeholder')"
        :aria-describedby="showCounter ? counterId : undefined"
        class="bg-default/10 placeholder:text-default-400 focus:bg-default/15 min-w-0 flex-1 resize-none rounded-kun-lg px-3 py-2 text-base leading-6 outline-none transition-colors"
        :style="{ overflowY: 'hidden' }"
        @keydown="onKeydown"
        @input="onInput"
        @paste="onPaste"
      />
      <slot name="suffix" />
      <span
        v-if="showCounter"
        :class="cn('shrink-0 self-center px-1 text-xs tabular-nums', remaining < 0 ? 'text-danger' : 'text-foreground-muted')"
      >
        <span aria-hidden="true">{{ remaining }}</span>
        <span :id="counterId" class="sr-only">
          {{
            remaining < 0
              ? t('chatComposer.overLimit', { count: -remaining })
              : t('chatComposer.remaining', { count: remaining })
          }}
        </span>
      </span>
      <button
        type="button"
        :disabled="!canSend"
        :class="
          cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
            canSend ? 'text-primary hover:bg-primary/15' : 'text-default-400 cursor-default'
          )
        "
        :aria-label="editing ? t('chatComposer.save') : t('chatComposer.send')"
        @click="submit"
      >
        <KunIcon :name="editing ? 'lucide:check' : 'lucide:send-horizontal'" class="text-xl" />
      </button>
    </div>

    <div
      v-if="dragging"
      class="border-primary bg-content1/95 text-primary pointer-events-none absolute inset-1 flex items-center justify-center rounded-kun-lg border-2 border-dashed text-sm font-medium"
    >
      {{ t('chatComposer.dropHint') }}
    </div>
  </div>
</template>
