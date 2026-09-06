<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const selected = ref(['reply'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'reply', label: '新回复', description: '有人回复我的主题或评论', icon: 'lucide:info' },
  { value: 'patch', label: '新补丁', description: '关注的游戏有新补丁发布', icon: 'lucide:download' },
  { value: 'weekly', label: '每周精选', description: '每周一推送本周热门', icon: 'lucide:calendar' },
]
</script>

<template>
  <KunCheckBoxGroup
    v-model="selected"
    :options="options"
    variant="card"
    orientation="horizontal"
    color="secondary"
    label="邮件通知"
    :hide-indicator="true"
  />
</template>
