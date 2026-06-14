<script setup lang="ts">
import { ref } from 'vue'

// `controls="false"` hides the +/- stepper buttons, leaving a plain numeric
// field. Arrow-key stepping still works.
const v = ref<number | null>(42)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="v"
      label="无步进按钮"
      :controls="false"
      :min="0"
    />
  </div>
</template>
