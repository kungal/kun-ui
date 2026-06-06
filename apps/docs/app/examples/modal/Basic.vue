<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open modal</KunButton>
  <KunModal v-model="open">
    <h3 class="text-lg font-semibold">Hello from a modal</h3>
    <p class="text-default-600 mt-1">
      Teleported to body, focus-trapped, body-scroll-locked. Press Esc or click
      the backdrop to close.
    </p>
  </KunModal>
</template>
