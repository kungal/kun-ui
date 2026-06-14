<template>
  <!-- 不提供默认插槽时，徽标独立内联渲染（不绝对定位）。 -->
  <span class="inline-flex items-center gap-2">
    未读
    <KunBadge :count="3" color="danger" aria-label="3 条未读" />
  </span>
  <span class="inline-flex items-center gap-2">
    在线
    <KunBadge variant="dot" color="success" aria-label="在线" />
  </span>
  <span class="inline-flex items-center gap-2">
    通知
    <KunBadge :count="120" :max="99" color="primary" aria-label="120 条通知" />
  </span>
</template>
