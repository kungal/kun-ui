<script setup lang="ts">
import type { KunMenuEntry } from '@kungal/ui-vue'

// One command list, grouped by separators. `shortcut` is display only — bind
// the keys yourself. Separators that end up leading, trailing or doubled (say,
// "Edit" and "Delete" filtered out for a post that is not yours) are dropped.
const isOwner = true
const items: KunMenuEntry[] = [
  { key: 'reply', label: '回复', icon: 'lucide:reply', shortcut: 'R' },
  { key: 'quote', label: '引用', icon: 'lucide:quote', shortcut: 'Q' },
  { key: 'copy', label: '复制链接', icon: 'lucide:copy', shortcut: 'Mod+Shift+C' },
  { type: 'separator' },
  ...(isOwner
    ? ([
        { key: 'edit', label: '编辑', icon: 'lucide:pencil', shortcut: 'E' },
        { key: 'delete', label: '删除', icon: 'lucide:trash-2', color: 'danger', shortcut: 'Mod+Backspace' },
      ] as KunMenuEntry[])
    : []),
]
</script>

<template>
  <KunDropdown :items="items" @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')">
    <template #trigger>
      <KunButton variant="light" color="default" is-icon-only aria-label="更多操作">
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
