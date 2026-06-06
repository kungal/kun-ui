import { computed, ref } from 'vue'

// Loli mascot popup (しゅがてん!-inspired). Store + mounted provider — no
// imperative render() / stolen Nuxt appContext. Mount <KunLoliProvider/>
// once; call useKunLoliInfo(message, durationSeconds?) from anywhere.

interface KunLoliEntry {
  message: string
  duration: number // ms
  key: number
}

const current = ref<KunLoliEntry | null>(null)
let seed = 0
let clearTimer: ReturnType<typeof setTimeout> | null = null

export const useKunLoliState = () => ({
  current: computed(() => current.value),
  clear: () => {
    current.value = null
    if (clearTimer) {
      clearTimeout(clearTimer)
      clearTimer = null
    }
  },
})

export const useKunLoliInfo = (message: string, duration?: number): void => {
  const durationMs = duration ? duration * 1000 : 3000
  seed++
  // `key` retriggers the enter animation when called again before clearing.
  current.value = { message, duration: durationMs, key: seed }

  if (clearTimer) clearTimeout(clearTimer)
  // +600ms covers the leave Transition before removing from the DOM.
  clearTimer = setTimeout(() => {
    current.value = null
    clearTimer = null
  }, durationMs + 600)
}
