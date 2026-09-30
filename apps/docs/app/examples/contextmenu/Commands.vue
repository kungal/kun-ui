<script setup lang="ts">
import { ref } from 'vue'
import type { KunMenuEntry } from '@kungal/ui-vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
// The same command list an app renders as a right-click menu, a ⋯ menu and a
// long-press menu: separators, shortcuts and one level of submenu.
const items: KunMenuEntry[] = [
  { key: 'reply', label: '回复', icon: 'lucide:reply', shortcut: 'R' },
  { key: 'quote', label: '引用', icon: 'lucide:quote', shortcut: 'Q' },
  { key: 'copy', label: '复制文本', icon: 'lucide:copy', shortcut: 'Mod+C' },
  {
    key: 'share',
    label: '分享',
    icon: 'lucide:external-link',
    children: [
      { key: 'share-link', label: '复制帖子链接', shortcut: 'Mod+Shift+C' },
      { key: 'share-image', label: '生成分享图片' },
    ],
  },
  { type: 'separator' },
  { key: 'report', label: '举报', icon: 'lucide:flag', color: 'warning' },
  { key: 'delete', label: '删除', icon: 'lucide:trash-2', color: 'danger', shortcut: 'Mod+Backspace' },
]
const onContext = (e: MouseEvent) => {
  position.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}
</script>

<template>
  <KunCard bordered class-name="w-full max-w-md" @contextmenu.prevent="onContext">
    <div class="flex items-center gap-2">
      <KunAvatar :user="{ id: 1, name: '鲲', avatar: '' }" :is-navigation="false" size="sm" />
      <span class="text-sm font-medium">鲲</span>
      <span class="text-foreground-muted text-xs">3 分钟前</span>
    </div>
    <p class="text-default-700 mt-2 text-sm">
      刚通关了《星空列车与白的旅行》，结局那段配乐真的太好了。右键这条回复试试。
    </p>
    <KunContextMenu
      :visible="visible"
      :items="items"
      :position="position"
      @close="visible = false"
      @select="(i) => useKunMessage(`已选择 ${i.label}`, 'info')"
    />
  </KunCard>
</template>
