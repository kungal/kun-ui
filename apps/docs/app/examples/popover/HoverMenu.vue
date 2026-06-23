<script setup lang="ts">
// 导航悬停菜单:一排 KunPopover，trigger="hover" + 共享 group。
// 悬停打开;横向移到兄弟项瞬间切换(跳过 openDelay);下移到面板时靠坐标安全三角
// 不会中途关闭;点链接跳转;键盘/Esc 仍可用;触屏自动退回点击。
const menus = [
  { label: '产品', items: ['可视小说引擎', 'Galgame 资源', 'CG 画廊'] },
  { label: '社区', items: ['论坛', '评测', '同人活动'] },
  { label: '资源', items: ['下载中心', '补丁站', 'API 文档'] },
]
</script>

<template>
  <nav class="flex items-center gap-1">
    <KunPopover
      v-for="m in menus"
      :key="m.label"
      trigger="hover"
      group="docs-nav"
      position="bottom-start"
      inner-class="p-1"
      opaque
    >
      <template #trigger>
        <button
          class="rounded-kun-md hover:bg-default-100 px-3 py-2 text-sm font-medium transition-colors"
        >
          {{ m.label }}
        </button>
      </template>

      <div class="flex w-44 flex-col">
        <KunLink
          v-for="it in m.items"
          :key="it"
          to="#"
          color="default"
          underline="none"
          class-name="rounded-kun-md hover:bg-default-100 px-3 py-2 text-sm"
        >
          {{ it }}
        </KunLink>
      </div>
    </KunPopover>
  </nav>
</template>
