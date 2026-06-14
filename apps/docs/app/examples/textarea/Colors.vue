<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <KunTextarea v-model="text" color="primary" placeholder="primary" :rows="2" />
    <KunTextarea v-model="text" color="secondary" placeholder="secondary" :rows="2" />
    <KunTextarea v-model="text" color="success" placeholder="success" :rows="2" />
    <KunTextarea v-model="text" color="warning" placeholder="warning" :rows="2" />
    <KunTextarea v-model="text" color="danger" placeholder="danger" :rows="2" />
  </div>
</template>
