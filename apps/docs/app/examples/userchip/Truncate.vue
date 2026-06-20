<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const avatar = '/favicon.webp'

// Long names and descriptions truncate with an ellipsis inside a constrained box.
const user: KunUser = {
  id: 1,
  name: '这是一个非常非常长的用户名会被自动截断显示省略号',
  avatar,
}
</script>

<template>
  <div class="w-56">
    <KunUserChip
      :user="user"
      description="同样很长的一段个人简介也会被截断而不会撑破布局"
      :is-navigation="false"
    />
  </div>
</template>
