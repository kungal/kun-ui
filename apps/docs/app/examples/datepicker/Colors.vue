<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div class="flex max-w-md flex-col gap-3">
    <KunDatePicker v-model="a" color="primary" label="primary" />
    <KunDatePicker v-model="b" color="secondary" label="secondary" />
    <KunDatePicker v-model="c" color="success" label="success" />
  </div>
</template>
