<script setup lang="ts">
import { ref } from 'vue'
const tags = ref<string[]>(['vue', 'nuxt'])
</script>

<template>
  <div class="max-w-md">
    <KunTagInput
      v-model="tags"
      label="技术栈"
      placeholder="输入后回车，或用逗号 / 分号分隔"
      :max-tags="5"
      :split-chars="[',', '，', ';', ' ']"
      :show-counter="true"
    />
    <p class="text-default-400 mt-1 text-xs">最多 5 个标签，支持粘贴批量拆分</p>
  </div>
</template>
