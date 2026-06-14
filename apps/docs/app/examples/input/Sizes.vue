<script setup lang="ts">
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput v-model="v" size="xs" placeholder="xs" />
    <KunInput v-model="v" size="sm" placeholder="sm" />
    <KunInput v-model="v" size="md" placeholder="md" />
    <KunInput v-model="v" size="lg" placeholder="lg" />
    <KunInput v-model="v" size="xl" placeholder="xl" />
  </div>
</template>
