<script setup lang="ts">
import { ref } from 'vue'

// `isInvalid` tints every cell with the danger color; `disabled` blocks input.
const pin = ref('12')
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">无效 (isInvalid)</p>
      <KunPinInput v-model="pin" :length="4" :is-invalid="true" />
    </div>
    <div>
      <p class="text-default-700 mb-1 text-sm font-medium">禁用</p>
      <KunPinInput v-model="pin" :length="4" :disabled="true" />
    </div>
  </div>
</template>
