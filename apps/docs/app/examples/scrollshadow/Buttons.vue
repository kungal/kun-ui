<script setup lang="ts">
// 窄屏上的编辑器工具栏:只有边缘阴影时用户常常意识不到右边还有按钮。
// scroll-buttons 在可滚动的一侧浮出与 KunTab 相同的箭头,点击翻过约 80% 的宽度;
// 与 draggable 同用时拖动不会误触箭头。
const actions = [
  { icon: 'lucide:quote', label: '引用' },
  { icon: 'lucide:at-sign', label: '提及' },
  { icon: 'lucide:image', label: '插入图片' },
  { icon: 'lucide:paperclip', label: '附件' },
  { icon: 'lucide:smile-plus', label: '表情' },
  { icon: 'lucide:pencil', label: '编辑' },
  { icon: 'lucide:copy', label: '复制' },
  { icon: 'lucide:pin', label: '置顶' },
  { icon: 'lucide:eye', label: '预览' },
  { icon: 'lucide:upload', label: '上传' },
  { icon: 'lucide:download', label: '下载' },
  { icon: 'lucide:external-link', label: '新窗口打开' },
  { icon: 'lucide:flag', label: '举报' },
  { icon: 'lucide:trash-2', label: '删除' },
]
</script>

<template>
  <div class="border-default-200 bg-content1 rounded-kun-lg max-w-xs border p-1">
    <KunScrollShadow
      axis="horizontal"
      scroll-buttons
      wheel
      draggable
      content-class="gap-1"
      aria-label="编辑器工具栏"
    >
      <KunButton
        v-for="a in actions"
        :key="a.icon"
        variant="light"
        size="sm"
        is-icon-only
        :aria-label="a.label"
      >
        <KunIcon :name="a.icon" />
      </KunButton>
    </KunScrollShadow>
  </div>
</template>
