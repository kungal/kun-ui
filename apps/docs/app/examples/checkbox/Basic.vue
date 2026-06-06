<script setup lang="ts">
import { ref } from 'vue'
const agree = ref(true)
const locked = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="agree" label="I agree to the terms" />
    <KunCheckBox v-model="locked" label="Disabled" disabled />
  </div>
</template>
