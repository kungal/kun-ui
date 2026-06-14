<script setup lang="ts">
import { ref } from 'vue'
const a = ref<string[]>(['vue', 'react'])
const b = ref<string[]>(['vue', 'react'])
const c = ref<string[]>(['vue', 'react'])
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <KunTagInput v-model="a" variant="bordered" label="bordered（默认）" />
    <KunTagInput v-model="b" variant="flat" label="flat" />
    <KunTagInput v-model="c" variant="flat" color="secondary" label="flat · secondary" />
  </div>
</template>
