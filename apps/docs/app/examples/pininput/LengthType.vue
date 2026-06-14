<script setup lang="ts">
import { ref } from 'vue'

// `length` sets the number of cells. `type="numeric"` (default) restricts
// input to digits; `type="text"` accepts letters too.
const code = ref('')
const text = ref('')
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">4 位数字</p>
      <KunPinInput v-model="code" :length="4" type="numeric" />
    </div>
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">5 位字母数字</p>
      <KunPinInput v-model="text" :length="5" type="text" />
    </div>
  </div>
</template>
