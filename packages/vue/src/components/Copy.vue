<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { cn, decodeIfEncoded } from '@kungal/ui-core'
import { useKunCopy } from '../composables/useKunCopy'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunCopyProps } from './types'

defineOptions({ name: 'KunCopy' })

const { t } = useKunLocale()

const props = withDefaults(defineProps<KunCopyProps>(), {
  name: '',
  variant: 'light',
  color: 'primary',
  size: 'md',
  // No `rounded` default: defer to the global config.rounded (default 'md').
  className: '',
})

// Transient confirmation: swap the icon (copy → check) + label after a copy,
// and reset after ~1.5s. The live region announces it to assistive tech.
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const doCopy = async () => {
  // Only flip to the "copied" affordance on a REAL successful write — otherwise
  // the button would falsely show the ✓ copied state while useKunCopy
  // toasts a failure.
  const copiedOk = await useKunCopy(props.text, {
    success: t('copy.success', { text: decodeIfEncoded(props.text) }),
    error: t('copy.failure', { text: decodeIfEncoded(props.text) }),
  })
  if (!copiedOk) return
  copied.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1500)
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <KunButton
    :variant="variant"
    :color="copied ? 'success' : color"
    :size="size"
    :rounded="rounded"
    :class-name="cn('gap-2', className)"
    @click="doCopy"
  >
    <span aria-live="polite">
      {{ copied ? (copiedText ?? t('copy.copied')) : decodeIfEncoded(name ? name : text) }}
    </span>
    <KunIcon :name="copied ? 'lucide:check' : 'lucide:copy'" />
  </KunButton>
</template>
