<script setup lang="ts">
import { ref } from 'vue'
import type {
  KunSelectOption,
  KunDropdownItem,
  KunContextMenuItem,
} from '@kungal/ui-vue'

const selected = ref('vue')
const selectOptions: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
]

const dropdownItems: KunDropdownItem[] = [
  { key: 'edit', label: 'Edit', icon: 'lucide:copy' },
  { key: 'dup', label: 'Duplicate', icon: 'lucide:copy' },
  { key: 'archive', label: 'Archive', icon: 'lucide:download', disabled: true },
  { key: 'delete', label: 'Delete', icon: 'lucide:x', color: 'danger' },
]
const lastAction = ref('')

const drawerOpen = ref(false)
const drawerPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const openDrawer = (p: 'left' | 'right' | 'top' | 'bottom') => {
  drawerPlacement.value = p
  drawerOpen.value = true
}

const ctxVisible = ref(false)
const ctxPos = ref({ x: 0, y: 0 })
const ctxItems: KunContextMenuItem[] = [
  { key: 'copy', label: 'Copy', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download' },
  { key: 'delete', label: 'Delete', icon: 'lucide:x', color: 'danger' },
]
const onContext = (e: MouseEvent) => {
  ctxPos.value = { x: e.clientX, y: e.clientY }
  ctxVisible.value = true
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Select · Dropdown · Drawer · ContextMenu</h2>

    <div class="grid max-w-md gap-3">
      <KunSelect
        v-model="selected"
        label="Framework"
        :options="selectOptions"
        placeholder="Pick one"
      />
      <p class="text-default-500 text-sm">selected: {{ selected }}</p>
    </div>

    <h3 class="mt-2 text-base font-medium">Dropdown (menu)</h3>
    <div class="flex items-center gap-3">
      <KunDropdown :items="dropdownItems" @select="(i) => (lastAction = i.key)">
        <template #trigger>
          <KunButton variant="bordered">Actions ▾</KunButton>
        </template>
      </KunDropdown>
      <span class="text-default-500 text-sm">last: {{ lastAction || '—' }}</span>
    </div>

    <h3 class="mt-2 text-base font-medium">Drawer</h3>
    <div class="flex flex-wrap gap-2">
      <KunButton variant="bordered" @click="openDrawer('left')">Left</KunButton>
      <KunButton variant="bordered" @click="openDrawer('right')">Right</KunButton>
      <KunButton variant="bordered" @click="openDrawer('top')">Top</KunButton>
      <KunButton variant="bordered" @click="openDrawer('bottom')">Bottom</KunButton>
    </div>
    <KunDrawer v-model="drawerOpen" :placement="drawerPlacement" title="Drawer">
      <p class="text-default-600 text-sm">
        Slides from {{ drawerPlacement }} (bottom sheet on mobile). Focus-trapped,
        scroll-locked, Esc to close.
      </p>
    </KunDrawer>

    <h3 class="mt-2 text-base font-medium">Context menu (right-click)</h3>
    <div
      class="border-default-200 text-default-500 flex h-24 items-center justify-center rounded-kun-md border border-dashed text-sm"
      @contextmenu.prevent="onContext"
    >
      Right-click inside this box
    </div>
    <KunContextMenu
      :visible="ctxVisible"
      :position="ctxPos"
      :items="ctxItems"
      @close="ctxVisible = false"
      @select="(i) => (lastAction = i.key)"
    />
  </section>
</template>
