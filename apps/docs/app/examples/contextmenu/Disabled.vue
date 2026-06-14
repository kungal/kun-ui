<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
// `disabled: true` dims the item and skips it during keyboard navigation —
// it can't be focused or selected.
const items: KunContextMenuItem[] = [
  { key: 'back', label: 'Back', icon: 'lucide:arrow-left' },
  { key: 'forward', label: 'Forward', icon: 'lucide:arrow-right', disabled: true },
  { key: 'reload', label: 'Reload', icon: 'lucide:rotate-cw' },
  { key: 'save', label: 'Save as…', icon: 'lucide:download', disabled: true },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <div
    class="border-default-200 text-default-500 rounded-kun-lg flex h-28 w-full max-w-md items-center justify-center border border-dashed text-sm"
    @contextmenu.prevent="onContext"
  >
    右键这里
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </div>
</template>
