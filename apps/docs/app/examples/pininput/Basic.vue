<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const done = ref('')
</script>

<template>
  <div>
    <KunPinInput v-model="pin" :length="6" @complete="(v) => (done = v)" />
    <p class="text-default-500 mt-2 text-sm">值: {{ pin || '—' }}</p>
    <p v-if="done" class="text-success mt-1 text-sm">complete: {{ done }}</p>
  </div>
</template>
