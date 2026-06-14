<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// `color` tints the item (light variant) — handy for distinguishing intent,
// e.g. a destructive action in danger.
const items: KunDropdownItem[] = [
  { key: 'open', label: 'Open', icon: 'lucide:external-link', color: 'primary' },
  { key: 'approve', label: 'Approve', icon: 'lucide:circle-check', color: 'success' },
  { key: 'flag', label: 'Flag', icon: 'lucide:triangle-alert', color: 'warning' },
  { key: 'delete', label: 'Delete', icon: 'lucide:circle-x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">彩色菜单项</KunButton>
    </template>
  </KunDropdown>
</template>
