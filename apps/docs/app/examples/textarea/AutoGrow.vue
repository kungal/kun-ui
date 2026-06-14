<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="max-w-md">
    <KunTextarea
      v-model="text"
      label="Bio"
      placeholder="高度随内容自动增长,并显示字数"
      :rows="2"
      :maxlength="200"
      auto-grow
      show-char-count
    />
  </div>
</template>
