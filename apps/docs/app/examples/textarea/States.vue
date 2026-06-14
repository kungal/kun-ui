<script setup lang="ts">
import { ref } from 'vue'
const a = ref('')
const b = ref('Locked content')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <KunTextarea v-model="a" label="With error" error="Please enter a message." :rows="3" />
    <KunTextarea v-model="b" label="Disabled" disabled :rows="3" />
    <KunTextarea v-model="a" label="Small" size="sm" placeholder="size=sm" :rows="3" />
    <KunTextarea v-model="a" label="Large" size="lg" placeholder="size=lg" :rows="3" />
  </div>
</template>
