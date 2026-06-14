<script setup lang="ts">
import { ref } from 'vue'
const a = ref<File | null>(null)
const b = ref<File | null>(null)
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunFileInput v-model="a" :disabled="true" trigger-text="已禁用" />
    <KunFileInput v-model="b" error="请选择一个文件" trigger-text="必填项" />
  </div>
</template>
