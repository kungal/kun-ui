<script setup lang="ts">
import type { KunMenuEntry } from '@kungal/ui-vue'

// `children` opens a submenu: hover, → or a tap. One level only.
const items: KunMenuEntry[] = [
  { key: 'pin', label: '置顶对话', icon: 'lucide:pin' },
  {
    key: 'mute',
    label: '静音通知',
    icon: 'lucide:bell-off',
    children: [
      { key: 'mute-1h', label: '1 小时' },
      { key: 'mute-8h', label: '8 小时' },
      { key: 'mute-1d', label: '1 天' },
      { type: 'separator' },
      { key: 'mute-forever', label: '直到我取消' },
    ],
  },
  { key: 'archive', label: '归档', icon: 'lucide:archive' },
  { type: 'separator' },
  { key: 'delete', label: '删除对话', icon: 'lucide:trash-2', color: 'danger' },
]
</script>

<template>
  <KunDropdown :items="items" @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')">
    <template #trigger>
      <KunButton variant="bordered" color="default">
        对话设置
        <KunIcon name="lucide:chevron-down" />
      </KunButton>
    </template>
  </KunDropdown>
</template>
