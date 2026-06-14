<script setup lang="ts">
import { ref } from 'vue'

// `step` controls the increment for the stepper buttons / arrow keys.
// `precision` fixes the number of decimal places on commit (blur).
const price = ref<number | null>(19.9)
const rate = ref<number | null>(0.25)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="price"
      label="价格 (step 0.1, precision 2)"
      :min="0"
      :step="0.1"
      :precision="2"
    />
    <KunNumberInput
      v-model="rate"
      label="利率 (step 0.05, precision 2)"
      :min="0"
      :max="1"
      :step="0.05"
      :precision="2"
    />
  </div>
</template>
