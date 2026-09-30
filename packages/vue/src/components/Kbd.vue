<script setup lang="ts">
import { computed } from 'vue'
import {
  formatKunShortcut,
  resolveKunShortcut,
  speakKunShortcut,
  type KunShortcutKey,
} from '@kungal/ui-core'
import { useKunShortcutPlatform } from '../composables/useKunShortcutPlatform'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunKbdProps } from './types'

defineOptions({ name: 'KunKbd' })

const props = withDefaults(defineProps<KunKbdProps>(), {
  keys: '',
  variant: 'keycap',
})

defineSlots<{
  /** A single key written out, shown when `keys` is not set. */
  default?: () => unknown
}>()

const { t } = useKunLocale()
const platform = useKunShortcutPlatform()

const sequence = computed(() => (props.keys ? resolveKunShortcut(props.keys, platform.value) : []))
// The word a screen reader should hear in place of the label, or null when
// the label already is that word ("Shift", "Tab") and needs no hidden twin.
const spokenWord = (key: KunShortcutKey) => {
  if (!key.spoken) return null
  const word = t(`kbd.${key.spoken}`)
  return word === key.label ? null : word
}
const plainText = computed(() => (props.keys ? formatKunShortcut(props.keys, platform.value) : ''))
const spokenText = computed(() =>
  speakKunShortcut(sequence.value, (key) => t(`kbd.${key}`), t('kbd.then'))
)

// Sized in em, not by a size prop, so a key sits in prose, a tooltip or a
// button at that text's scale (Radix Themes' Kbd does the same).
const capClass =
  'border-default-200 bg-default-100 text-foreground-muted inline-flex h-[1.5em] min-w-[1.5em] items-center justify-center rounded-[0.3em] border border-b-2 px-[0.35em] [font-family:inherit] text-[0.8em] leading-none font-medium'
</script>

<template>
  <kbd v-if="!keys" :class="capClass"><slot /></kbd>
  <kbd
    v-else-if="variant === 'plain'"
    dir="ltr"
    class="text-foreground-muted [font-family:inherit] text-[0.85em] font-normal whitespace-nowrap"
  >
    <span aria-hidden="true">{{ plainText }}</span>
    <span class="sr-only">{{ spokenText }}</span>
  </kbd>
  <kbd
    v-else
    dir="ltr"
    class="inline-flex items-center gap-[0.5em] align-baseline [font-family:inherit] whitespace-nowrap"
  >
    <span v-for="(chord, ci) in sequence" :key="ci" class="inline-flex items-center gap-[0.2em]">
      <span v-if="ci > 0" class="sr-only">{{ t('kbd.then') }}</span>
      <kbd v-for="(key, ki) in chord" :key="ki" :class="capClass">
        <template v-if="spokenWord(key)">
          <span aria-hidden="true">{{ key.label }}</span>
          <span class="sr-only">{{ spokenWord(key) }}</span>
        </template>
        <template v-else>{{ key.label }}</template>
      </kbd>
    </span>
  </kbd>
</template>
