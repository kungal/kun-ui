<script setup lang="ts">
import { ref } from 'vue'

// `min` / `max` clamp the committed value: typing 999 and blurring snaps it
// back to max, and the stepper buttons disable at each bound.
const qty = ref<number | null>(3)
</script>

<template>
  <div class="grid max-w-xs gap-2">
    <KunNumberInput
      v-model="qty"
      label="数量 (0 – 10)"
      :min="0"
      :max="10"
    />
    <p class="text-default-500 text-sm">值: {{ qty ?? '—' }}</p>
  </div>
</template>
