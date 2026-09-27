<script setup lang="ts">
import { ref } from 'vue'
import type { KunStepItem } from '@kungal/ui-vue'
const current = ref(0)
const items: KunStepItem[] = [
  { title: '下载本体', description: '游戏本体' },
  { title: '下载补丁', description: '翻译 / 破解' },
  { title: '打补丁', description: '图文教程' },
]
const guides = [
  '从下方镜像任选其一下载游戏本体，解压到不含中文的路径。',
  '按游戏版本挑选汉化补丁，注意与本体版本号一致。',
  '将补丁文件覆盖到游戏根目录，以管理员身份运行启动器。',
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <!-- :linear="false"：引导类流程，任意一步都能直接点过去 -->
    <KunSteps v-model:current="current" :items="items" :linear="false" size="sm" />
    <KunCard bordered padding="md">
      <p class="text-sm">{{ guides[current] }}</p>
    </KunCard>
  </div>
</template>
