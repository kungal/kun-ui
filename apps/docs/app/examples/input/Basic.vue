<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>

<template>
  <KunInput
    v-model="value"
    label="Username"
    placeholder="Type here…"
    helper-text="Helper text below the field."
    class-name="max-w-xs"
  />
</template>
