<script setup lang="ts">
import { ref } from 'vue'
const files = ref<File[]>([])
</script>

<template>
  <div class="max-w-md">
    <KunFileInput
      v-model:files="files"
      :multiple="true"
      trigger-text="选择多个文件"
      trigger-color="secondary"
      description="可一次选择多个文件"
    />
    <ul class="text-default-600 mt-2 text-sm">
      <li v-for="f in files" :key="f.name">{{ f.name }}</li>
      <li v-if="files.length === 0" class="text-default-400">尚未选择文件</li>
    </ul>
  </div>
</template>
