<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// `disabled: true` dims the item and removes it from keyboard navigation /
// type-ahead — it can't be focused or selected.
const items: KunDropdownItem[] = [
  { key: 'view', label: 'View', icon: 'lucide:eye' },
  { key: 'duplicate', label: 'Duplicate', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download', disabled: true },
  { key: 'delete', label: 'Delete', icon: 'lucide:circle-x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">含禁用项</KunButton>
    </template>
  </KunDropdown>
</template>
