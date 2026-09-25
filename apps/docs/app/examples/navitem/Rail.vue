<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { key: 'home', label: '首页', icon: 'lucide:home' },
  { key: 'community', label: '社区', icon: 'lucide:messages-square' },
  { key: 'calendar', label: '发售月历', icon: 'lucide:calendar' },
  { key: 'settings', label: '设置', icon: 'lucide:settings' },
]
const current = ref('home')
</script>

<template>
  <nav class="flex w-24 flex-col gap-1">
    <KunNavItem
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :icon="item.icon"
      :current="current === item.key"
      stacked
      @click="current = item.key"
    />
  </nav>
</template>
