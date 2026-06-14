<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" label="禁用" :disabled="true" />
    <KunTagInput v-model="b" label="标签" error="至少需要一个标签" />
  </div>
</template>
