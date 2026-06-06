<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunFileInput v-model="file" />
    <KunFileInput
      v-model="file"
      trigger-text="Upload avatar"
      trigger-color="secondary"
      accept="image/*"
    />
  </div>
</template>
