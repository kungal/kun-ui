<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '达成条件' },
  { title: '提交申请' },
  { title: '管理员审核', status: 'error' },
  { title: '成为创作者' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <KunSteps :items="items" :current="2" size="sm" />
    <KunInfo
      color="danger"
      variant="flat"
      icon="lucide:circle-x"
      title="申请未通过"
      description="已合并的词条更新请求不足 3 条，补足后可以重新提交。"
    />
  </div>
</template>
