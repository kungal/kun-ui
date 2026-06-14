<script setup lang="ts">
import { ref } from 'vue'
const value = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="value" size="xs" label="xs" />
    <KunSwitch v-model="value" size="sm" label="sm" />
    <KunSwitch v-model="value" size="md" label="md" />
    <KunSwitch v-model="value" size="lg" label="lg" />
    <KunSwitch v-model="value" size="xl" label="xl" />
  </div>
</template>
