<script setup lang="ts">
import { ref } from 'vue'

const single = ref<string | null>('')
const range = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">DatePicker (date-fns)</h2>

    <div class="grid max-w-md gap-4 sm:grid-cols-2">
      <div>
        <KunDatePicker v-model="single" label="Single date" />
        <p class="text-default-500 mt-1 text-sm">value: {{ single || '—' }}</p>
      </div>
      <div>
        <KunDatePicker v-model="range" mode="range" label="Date range" />
        <p class="text-default-500 mt-1 text-sm">value: {{ range }}</p>
      </div>
    </div>
  </section>
</template>
