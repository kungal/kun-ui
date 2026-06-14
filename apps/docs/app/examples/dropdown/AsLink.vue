<script setup lang="ts">
import type { KunDropdownItem } from '@kungal/ui-vue'

// Items with `href` render a real, crawlable <a> (NuxtLink) instead of a
// <button> — for navigational menus. Action items omit `href`.
const items: KunDropdownItem[] = [
  { key: 'docs', label: 'Documentation', icon: 'lucide:book-open', href: '/components/button' },
  { key: 'overlay', label: 'Overlay 组件', icon: 'lucide:package', href: '/components/dropdown' },
  { key: 'github', label: 'GitHub', icon: 'lucide:github', href: 'https://github.com/KUN1007/kun-ui' },
]
</script>

<template>
  <KunDropdown :items="items">
    <template #trigger>
      <KunButton variant="bordered">导航菜单</KunButton>
    </template>
  </KunDropdown>
</template>
