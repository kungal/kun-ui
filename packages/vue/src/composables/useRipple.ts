// Reference: https://github.com/nextui-org/nextui useRipple

import { ref, onUnmounted } from 'vue'

export type RippleType = {
  key: number
  x: number
  y: number
  size: number
}

export const useRipple = () => {
  const ripples = ref<RippleType[]>([])
  // Monotonic key — Date.now() collides for two clicks in the same millisecond
  // (duplicate Vue keys → render glitches).
  let nextKey = 0
  // `ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout` so this
  // composable carries no @types/node dependency — it runs in the browser.
  const timeouts = new Set<ReturnType<typeof setTimeout>>()

  const onClick = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement

    const size = Math.max(target.clientWidth, target.clientHeight)
    const rect = target.getBoundingClientRect()

    ripples.value.push({
      key: ++nextKey,
      size,
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
    })

    const timeoutId = setTimeout(() => {
      ripples.value.shift()
      timeouts.delete(timeoutId)
    }, 600)

    timeouts.add(timeoutId)
  }

  onUnmounted(() => {
    timeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    timeouts.clear()
    ripples.value = []
  })

  return {
    ripples,
    onClick,
  }
}
