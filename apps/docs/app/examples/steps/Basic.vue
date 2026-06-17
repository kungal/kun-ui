<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(1)
const items: KunStepItem[] = [
  { title: '填写信息', description: '账号与昵称' },
  { title: '验证邮箱', description: '点击邮件链接' },
  { title: '完成', description: '开始使用' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-5">
    <KunSteps :items="items" :current="current" />
    <div class="flex gap-2">
      <KunButton size="sm" variant="flat" :is-disabled="current === 0" @click="current--">上一步</KunButton>
      <KunButton size="sm" :is-disabled="current === items.length - 1" @click="current++">下一步</KunButton>
    </div>
  </div>
</template>
