<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { cn } from '@kungal/ui-core'
import { KUN_ACCORDION } from '../composables/accordionContext'
import type { KunAccordionProps } from './types'

// Collapsible sections. Put <KunAccordionItem>s inside; this component owns the
// open set. Single-open by default; pass `multiple` to allow several at once.
// `v-model` (string for single, string[] for multiple) makes it controlled;
// otherwise it's uncontrolled, seeded from `defaultValue`.
defineOptions({ name: 'KunAccordion' })

const props = withDefaults(defineProps<KunAccordionProps>(), {
  multiple: false,
  variant: 'light',
  defaultValue: undefined,
  className: '',
})

const model = defineModel<string | string[] | undefined>({ default: undefined })

const toArray = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : v === '' ? [] : [v]

// Uncontrolled fallback (used only when no v-model is bound).
const internal = ref<string[]>(toArray(props.defaultValue))
const controlled = computed(() => model.value !== undefined)
const openValues = computed(() =>
  controlled.value ? toArray(model.value) : internal.value
)

const commit = (next: string[]) => {
  if (controlled.value) model.value = props.multiple ? next : (next[0] ?? '')
  else internal.value = next
}

const toggle = (value: string) => {
  const open = new Set(openValues.value)
  if (open.has(value)) open.delete(value)
  else {
    if (!props.multiple) open.clear()
    open.add(value)
  }
  commit([...open])
}

provide(KUN_ACCORDION, {
  isOpen: (value: string) => openValues.value.includes(value),
  toggle,
  variant: computed(() => props.variant),
})

const containerClass = computed(() => {
  switch (props.variant) {
    case 'bordered':
      return 'border-kun divide-kun overflow-hidden rounded-kun-lg border divide-y'
    case 'splitted':
      return 'flex flex-col gap-3'
    default: // light
      return 'divide-kun divide-y'
  }
})
</script>

<template>
  <div :class="cn(containerClass, className)">
    <slot />
  </div>
</template>
