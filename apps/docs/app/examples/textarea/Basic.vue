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
      :rows="4"
      :maxlength="200"
      show-char-count
    />
  </div>
</template>
