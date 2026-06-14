<script setup lang="ts">
import { ref } from 'vue'
const value = ref(true)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="value" size="xs" color="primary" label="xs" />
    <KunCheckBox v-model="value" size="sm" color="primary" label="sm" />
    <KunCheckBox v-model="value" size="md" color="primary" label="md" />
    <KunCheckBox v-model="value" size="lg" color="primary" label="lg" />
    <KunCheckBox v-model="value" size="xl" color="primary" label="xl" />
  </div>
</template>
