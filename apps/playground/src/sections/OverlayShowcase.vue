<script setup lang="ts">
import { ref, computed } from 'vue'
import type {
  KunSelectOption,
  KunDropdownItem,
  KunContextMenuItem,
  KunCommandGroup,
  KunCommandItem,
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

// CommandPalette (⌘K). Static commands, grouped, filtered by the query the
// palette exposes via v-model:query — the shell does the dialog + keyboard nav.
const cmdkOpen = ref(false)
const cmdkQuery = ref('')
const cmdkPicked = ref('')
const COMMANDS: (KunCommandItem & { section: string })[] = [
  { value: 'dashboard', label: 'Go to Dashboard', section: 'Navigate', icon: 'lucide:layout-grid' },
  { value: 'settings', label: 'Go to Settings', section: 'Navigate', icon: 'lucide:settings' },
  { value: 'profile', label: 'Go to Profile', section: 'Navigate', icon: 'lucide:user' },
  { value: 'new-file', label: 'New file', section: 'Actions', icon: 'lucide:file-plus' },
  { value: 'copy-link', label: 'Copy link', section: 'Actions', icon: 'lucide:link' },
  { value: 'delete', label: 'Delete', section: 'Actions', icon: 'lucide:trash-2' },
]
const cmdkGroups = computed<KunCommandGroup[]>(() => {
  const q = cmdkQuery.value.trim().toLowerCase()
  const match = COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q))
  return ['Navigate', 'Actions']
    .map((s) => ({ label: s, items: match.filter((c) => c.section === s) }))
    .filter((g) => g.items.length)
})
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
      <KunDropdown :items="dropdownItems" @select="(i: { key: string }) => (lastAction = i.key)">
        <template #trigger>
          <KunButton variant="bordered">Actions ▾</KunButton>
        </template>
      </KunDropdown>
      <span class="text-default-500 text-sm">last: {{ lastAction || '—' }}</span>
    </div>

    <h3 class="mt-2 text-base font-medium">CommandPalette (⌘K)</h3>
    <div class="flex items-center gap-3">
      <KunCommandPalette
        v-model:open="cmdkOpen"
        v-model:query="cmdkQuery"
        :items="cmdkGroups"
        placeholder="Type a command…"
        @select="(i: KunCommandItem) => (cmdkPicked = String(i.value))"
      >
        <template #trigger="{ open, shortcut }">
          <KunButton variant="bordered" @click="open">
            Command palette
            <kbd class="border-kun ml-1 rounded border px-1 text-[10px]">{{ shortcut }}</kbd>
          </KunButton>
        </template>
      </KunCommandPalette>
      <span class="text-default-500 text-sm">picked: {{ cmdkPicked || '—' }}</span>
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
      @select="(i: { key: string }) => (lastAction = i.key)"
    />
  </section>
</template>
