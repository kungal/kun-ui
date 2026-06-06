<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('locked')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="a" label="With error" error="This field is required." />
    <KunInput v-model="b" label="Disabled" disabled />
  </div>
</template>
