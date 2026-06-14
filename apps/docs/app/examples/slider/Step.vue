<script setup lang="ts">
import { ref } from 'vue'

// `step` snaps the value to discrete increments anchored at `min`.
const v = ref(50)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider
      v-model="v"
      :min="0"
      :max="100"
      :step="25"
      :marks="[0, 25, 50, 75, 100]"
      :show-value="true"
      label="步长 25"
    />
  </div>
</template>
