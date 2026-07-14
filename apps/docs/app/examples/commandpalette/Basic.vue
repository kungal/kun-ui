<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KunCommandGroup, KunCommandItem } from '@kungal/ui-vue'

const open = ref(false)
const query = ref('')
const picked = ref('')

// Static commands. You compute the shown results from `query` — here a simple
// label filter, grouped by section. (Real apps plug in their own scoring.)
const COMMANDS: (KunCommandItem & { section: string })[] = [
  { value: 'home', label: '首页', section: '导航', icon: 'lucide:home' },
  { value: 'docs', label: '文档', section: '导航', icon: 'lucide:book-open' },
  { value: 'settings', label: '设置', section: '导航', icon: 'lucide:settings' },
  { value: 'new-file', label: '新建文件', section: '操作', icon: 'lucide:file-plus' },
  { value: 'copy-link', label: '复制链接', section: '操作', icon: 'lucide:link' },
  { value: 'delete', label: '删除', section: '操作', icon: 'lucide:trash-2' },
]
const groups = computed<KunCommandGroup[]>(() => {
  const q = query.value.trim().toLowerCase()
  const match = COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q))
  return ['导航', '操作']
    .map((s) => ({ label: s, items: match.filter((c) => c.section === s) }))
    .filter((g) => g.items.length)
})
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- `:shortcut="false"` here only because this page already has a ⌘K palette
         (the header search). In a real app keep the default and open with ⌘K. -->
    <KunCommandPalette
      v-model:open="open"
      v-model:query="query"
      :items="groups"
      :shortcut="false"
      placeholder="输入命令…"
      @select="(i: KunCommandItem) => (picked = String(i.value))"
    >
      <template #trigger="{ open }">
        <KunButton variant="bordered" @click="open">命令面板</KunButton>
      </template>
    </KunCommandPalette>
    <span class="text-default-500 text-sm">选中:{{ picked || '—' }}</span>
  </div>
</template>
