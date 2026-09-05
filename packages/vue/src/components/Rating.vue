<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunRatingProps } from './types'

defineOptions({ name: 'KunRating' })

const props = withDefaults(defineProps<KunRatingProps>(), {
  max: 5,
  readonly: false,
  disabled: false,
  size: 'md',
  ariaLabel: 'rating',
})

const modelValue = defineModel<number>({ default: 0 })

const emit = defineEmits<{
  /** The value the user clicked. Never emitted while `readonly` or `disabled`. */
  set: [value: number]
}>()

const hoverValue = ref(0)

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-6 w-6'
    default:
      return 'h-5 w-5'
  }
})

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))
const current = computed(() => hoverValue.value || modelValue.value || 0)

const setValue = (val: number) => {
  if (props.readonly || props.disabled) return
  modelValue.value = val
  emit('set', val)
}

const onEnter = (val: number) => {
  if (props.readonly || props.disabled) return
  hoverValue.value = val
}

const onLeave = () => {
  if (props.readonly || props.disabled) return
  hoverValue.value = 0
}
</script>

<template>
  <div class="inline-flex items-center gap-1" role="radiogroup" :aria-label="ariaLabel">
    <!-- `flex` on the star button: a lone <svg> in a block button sits on the
         line box's text baseline, and the strut's descent under it pushed the
         whole row ~2px above any text set beside it (a score, a review count). -->
    <button
      v-for="val in stars"
      :key="val"
      type="button"
      role="radio"
      :aria-checked="current >= val"
      :class="
        cn(
          'disabled:text-default-200 flex cursor-pointer items-center hover:scale-110 focus:outline-none disabled:cursor-not-allowed',
          current >= val ? 'text-secondary' : 'text-default-300'
        )
      "
      :disabled="disabled"
      :title="`${val}/${max}`"
      :aria-label="`${val} / ${max}`"
      @mouseenter="onEnter(val)"
      @mouseleave="onLeave"
      @click="setValue(val)"
    >
      <KunIcon name="lucide:lollipop" :class="cn('transition-colors', iconSize)" />
    </button>
  </div>
</template>
