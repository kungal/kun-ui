<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="loading = !loading">
      Toggle overlay
    </KunButton>
    <KunLoading :loading="loading">
      <KunCard class-name="flex h-32 items-center justify-center">
        <span>Content behind the loading overlay</span>
      </KunCard>
    </KunLoading>
  </div>
</template>
