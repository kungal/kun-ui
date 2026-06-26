<script setup lang="ts">
// 横向评分条:wheel 让鼠标滚轮左右滚,draggable 允许按住拖动。这里用 wheel="contain"
// ——滚到最前/最后把滚轮留在条上、页面不向下滚(仅在条可滚时生效,不会卡死页面);
// 想让它到边界交还页面滚动,改成 wheel 即可。触摸设备仍用原生滑动。
const ratings = [
  { user: '空想科学', score: 9.2 },
  { user: '月色真美', score: 8.7 },
  { user: '雨声', score: 9.5 },
  { user: '夏目', score: 8.1 },
  { user: '星之卡比', score: 7.9 },
  { user: '银河铁道', score: 9.0 },
  { user: '紫罗兰', score: 9.8 },
  { user: '凉宫', score: 8.4 },
  { user: '秒速五厘米', score: 8.8 },
  { user: '言叶之庭', score: 9.1 },
  { user: '你的名字', score: 9.6 },
  { user: '天气之子', score: 8.5 },
]
</script>

<template>
  <KunScrollShadow axis="horizontal" wheel="contain" draggable scrollbar="thin" class-name="max-w-md" aria-label="用户评分">
    <div
      v-for="r in ratings"
      :key="r.user"
      class="border-default-200 bg-content1 rounded-kun-lg flex h-24 w-28 shrink-0 flex-col items-center justify-center gap-1 border shadow-sm select-none"
    >
      <span class="text-primary text-2xl font-bold tabular-nums">{{ r.score.toFixed(1) }}</span>
      <span class="text-default-500 max-w-full truncate px-2 text-xs">{{ r.user }}</span>
    </div>
  </KunScrollShadow>
</template>
