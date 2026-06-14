<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="max-w-md">
    <KunTextarea
      v-model="text"
      label="Bio"
      placeholder="Tell us about yourself"
      description="A short description about yourself."
      :rows="4"
    />
  </div>
</template>
