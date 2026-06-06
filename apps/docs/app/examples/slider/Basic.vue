<script setup lang="ts">
import { ref } from 'vue'
const v = ref(40)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider v-model="v" :min="0" :max="100" :step="1" />
    <p class="text-default-600 mt-2 text-sm">Value: {{ v }}</p>
  </div>
</template>
