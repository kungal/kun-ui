<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '已提交', description: '资源已进入审核队列', icon: 'lucide:check' },
  { title: '审核中', description: '管理员正在审核' },
  { title: '已发布' },
]
</script>

<template>
  <KunSteps :items="items" :current="1" orientation="vertical" class-name="max-w-xs" />
</template>
