<script setup lang="ts">
import { ref } from 'vue'

const qty = ref<number | null>(3)
const price = ref<number | null>(19.9)
const free = ref<number | null>(null)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput v-model="qty" label="Quantity" :min="0" :max="10" />
    <KunNumberInput
      v-model="price"
      label="Price"
      :min="0"
      :step="0.1"
      :precision="2"
    />
    <KunNumberInput v-model="free" label="Unbounded (empty start)" />
  </div>
</template>
