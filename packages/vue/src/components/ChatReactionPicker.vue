<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { cn } from '@kungal/ui-core'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunChatReactionPickerProps } from './types'

// The reaction vocabulary as a grid. One reaction per person: choosing another
// replaces the current one, choosing the current one removes it. Animated
// images where the vocabulary has them, native emoji otherwise.
defineOptions({ name: 'KunChatReactionPicker' })

const props = withDefaults(defineProps<KunChatReactionPickerProps>(), {
  columns: 8,
  ariaLabel: undefined,
})

/** The viewer's current reaction key, or null. */
const model = defineModel<string | null>({ default: null })

const emit = defineEmits<{
  /** A reaction was chosen: its key, or null when the current one was
   *  chosen again (removing it). `v-model` has already been updated. */
  select: [reaction: string | null]
}>()

const { t } = useKunLocale()
const root = ref<HTMLElement | null>(null)
const active = ref(0)

const label = computed(() => props.ariaLabel ?? t('chat.reactions'))

const choose = (key: string) => {
  const next = model.value === key ? null : key
  model.value = next
  emit('select', next)
}

const focusAt = (index: number) => {
  const n = props.options.length
  if (!n) return
  active.value = (index + n) % n
  nextTick(() =>
    root.value?.querySelectorAll<HTMLElement>('button')[active.value]?.focus({ preventScroll: true })
  )
}

const onKeydown = (event: KeyboardEvent, index: number) => {
  const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: props.columns, ArrowUp: -props.columns }[
    event.key
  ]
  if (step !== undefined) {
    event.preventDefault()
    focusAt(index + step)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusAt(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusAt(props.options.length - 1)
  }
}

defineExpose({ focus: () => focusAt(active.value) })
</script>

<template>
  <div
    ref="root"
    role="group"
    :aria-label="label"
    class="grid gap-0.5"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >
    <button
      v-for="(option, i) in options"
      :key="option.key"
      type="button"
      :aria-label="option.label"
      :aria-pressed="model === option.key"
      :title="option.label"
      :tabindex="i === active ? 0 : -1"
      :class="
        cn(
          'flex aspect-square items-center justify-center rounded-kun-md text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary',
          model === option.key ? 'bg-primary/20' : 'hover:bg-default/20'
        )
      "
      @click="choose(option.key)"
      @keydown="onKeydown($event, i)"
      @focus="active = i"
    >
      <img
        v-if="option.image_url"
        :src="option.image_url"
        alt=""
        class="size-8 object-contain"
        loading="lazy"
        decoding="async"
      />
      <span v-else aria-hidden="true">{{ option.emoji }}</span>
    </button>
  </div>
</template>
