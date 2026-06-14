<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

const items: KunDropdownItem[] = [
  { key: 'view', label: 'View', icon: 'lucide:eye' },
  { key: 'copy', label: 'Copy', icon: 'lucide:copy' },
  { key: 'download', label: 'Download', icon: 'lucide:download' },
  { key: 'upload', label: 'Upload', icon: 'lucide:upload' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">
        操作
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
