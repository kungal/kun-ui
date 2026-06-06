<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kun/core'

const colors: (KunUIColor | 'background')[] = [
  'background',
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]

const clicks = ref(0)
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Card</h2>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KunCard v-for="color in colors" :key="color" :color="color">
        <span class="font-medium">{{ color }}</span>
        <span class="text-default-500 text-sm">color prop</span>
      </KunCard>
    </div>

    <h3 class="mt-2 text-base font-medium">Interactive</h3>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <KunCard :is-hoverable="true" color="default">
        <span class="font-medium">Hoverable</span>
        <span class="text-default-500 text-sm">hover to highlight</span>
      </KunCard>

      <KunCard :clickable="true" color="primary" @click="clicks++">
        <span class="font-medium">Clickable + ripple</span>
        <span class="text-default-500 text-sm">clicked {{ clicks }}×</span>
      </KunCard>

      <KunCard href="https://example.com" color="secondary">
        <span class="font-medium">href → renders &lt;a&gt;</span>
        <span class="text-default-500 text-sm">via config.linkComponent</span>
      </KunCard>
    </div>

    <h3 class="mt-2 text-base font-medium">Slots (header / footer)</h3>
    <KunCard class-name="max-w-md" color="default">
      <template #header>
        <span class="font-semibold">Card title</span>
      </template>
      <p class="text-default-600 text-sm">
        Body content lives in the default slot.
      </p>
      <template #footer>
        <span class="text-default-500 text-xs">Footer area</span>
      </template>
    </KunCard>
  </section>
</template>
