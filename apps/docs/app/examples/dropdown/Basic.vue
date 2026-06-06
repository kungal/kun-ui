<script setup lang="ts">
import type { KunContextMenuItem } from '@kungal/ui-vue'

const items: KunContextMenuItem[] = [
  { key: 'profile', label: 'Profile', icon: 'lucide:info' },
  { key: 'copy', label: 'Copy link', icon: 'lucide:copy' },
  { key: 'logout', label: 'Log out', icon: 'lucide:x', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">Open menu</KunButton>
    </template>
  </KunDropdown>
</template>
