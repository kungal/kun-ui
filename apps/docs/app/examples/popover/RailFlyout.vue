<script setup lang="ts">
// 侧边导航栏的右向悬停飞出菜单。position="right-start" 让菜单贴着 tile 顶部向右展开;
// autoPosition(默认)带来碰撞感知:靠近视口底部的高菜单会由 shift() 上移、size() 把
// 高度限制到可用空间并自动滚动,而不是冲出屏幕底部被裁掉。
// —— 这正是过去只能手写 `absolute left-full + max-h-[80vh]` 的场景,现在交给 KunPopover。
const groups = [
  { icon: 'lucide:home', label: '首页', items: ['仪表盘', '动态', '收藏'] },
  {
    icon: 'lucide:folder',
    label: '项目',
    items: Array.from({ length: 16 }, (_, i) => `项目 ${i + 1}`),
  },
  {
    icon: 'lucide:settings',
    label: '设置',
    items: ['个人资料', '账户', '外观', '通知', '安全', '账单'],
  },
]
</script>

<template>
  <div class="inline-flex flex-col gap-2 rounded-kun-lg border-kun border p-2">
    <KunPopover
      v-for="g in groups"
      :key="g.label"
      position="right-start"
      trigger="hover"
      group="rail"
      :aria-label="g.label"
      opaque
    >
      <template #trigger>
        <button
          class="hover:bg-default-100 flex size-10 items-center justify-center rounded-kun-md transition-colors"
          :aria-label="g.label"
        >
          <KunIcon :name="g.icon" class="size-5" />
        </button>
      </template>

      <div class="w-48 p-1">
        <p class="text-default-500 px-2 py-1 text-xs font-medium">{{ g.label }}</p>
        <button
          v-for="it in g.items"
          :key="it"
          class="hover:bg-default-100 block w-full rounded-kun-sm px-2 py-1.5 text-left text-sm"
        >
          {{ it }}
        </button>
      </div>
    </KunPopover>
  </div>
</template>
