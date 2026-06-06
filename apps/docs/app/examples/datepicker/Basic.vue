<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="date" label="Pick a date" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
  </div>
</template>
