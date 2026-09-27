<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(2)
const items: KunStepItem[] = [
  { title: '填写信息', description: '账号与昵称' },
  { title: '验证邮箱', description: '点击邮件链接' },
  { title: '设置头像', description: '可以稍后再改' },
  { title: '完成', description: '开始使用' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-5">
    <!-- v-model:current 让已走过的步骤可点击回退；前进仍只能走「下一步」 -->
    <KunSteps v-model:current="current" :items="items" />
    <div class="flex gap-2">
      <KunButton size="sm" variant="flat" :is-disabled="current === 0" @click="current--">上一步</KunButton>
      <KunButton size="sm" :is-disabled="current === items.length - 1" @click="current++">下一步</KunButton>
    </div>
  </div>
</template>
