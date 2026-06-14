<script setup lang="ts">
import { ref } from 'vue'
const a = ref('2026-06-14')
const b = ref('2026-06-14')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" label="可清除（默认）" :clearable="true" />
    <KunDatePicker v-model="b" label="禁用" :disabled="true" />
  </div>
</template>
