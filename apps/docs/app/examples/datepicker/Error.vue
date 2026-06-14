<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="出生日期" error="请选择一个有效的日期" />
  </div>
</template>
