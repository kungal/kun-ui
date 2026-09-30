<script setup lang="ts">
import { onScopeDispose, toRef, watch } from 'vue'
import { useKunPointerMenu } from '../composables/useKunPointerMenu'

// Hover intent for one submenu trigger in KunMenuList: open after 100 ms, and
// the safe triangle while the pointer travels to the panel. Renderless — the
// list renders the menuitem and binds `handlers` to it.
defineOptions({ name: 'KunMenuSubTrigger' })

const props = defineProps<{ panel: HTMLElement | null }>()
const open = defineModel<boolean>('open', { required: true })

defineSlots<{
  default: (props: {
    handlers: {
      pointerenter: (e: PointerEvent) => void
      pointerleave: (e: PointerEvent) => void
    }
  }) => unknown
}>()

const GRACE_MS = 300

const { triggerHandlers, panelHandlers, close } = useKunPointerMenu(toRef(props, 'panel'), {
  open,
  closeDelay: GRACE_MS,
})

// Leaving the panel starts a plain grace timer instead of the composable's
// triangle, which points AT the panel. The way back to the trigger crosses
// the parent menu's 4px padding; with the triangle, the submenu closed on the
// first pixel of it and the trigger reopened it ~150 ms later (Chromium, 3/3).
let leaveTimer: ReturnType<typeof setTimeout> | undefined
const clearLeave = () => {
  if (leaveTimer) clearTimeout(leaveTimer)
  leaveTimer = undefined
}

const handlers = {
  pointerenter: (e: PointerEvent) => {
    clearLeave()
    triggerHandlers.pointerenter(e)
  },
  pointerleave: (e: PointerEvent) => triggerHandlers.pointerleave(e),
}

const onPanelEnter = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  clearLeave()
  panelHandlers.pointerenter(e)
}
const onPanelLeave = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  clearLeave()
  leaveTimer = setTimeout(close, GRACE_MS)
}

watch(
  () => (open.value ? props.panel : null),
  (el, _, onCleanup) => {
    if (!el) return
    el.addEventListener('pointerenter', onPanelEnter)
    el.addEventListener('pointerleave', onPanelLeave)
    onCleanup(() => {
      el.removeEventListener('pointerenter', onPanelEnter)
      el.removeEventListener('pointerleave', onPanelLeave)
      clearLeave()
    })
  }
)

onScopeDispose(clearLeave)
</script>

<template>
  <slot :handlers="handlers" />
</template>
