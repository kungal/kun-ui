<script setup lang="ts">
import type { KunStepItem } from '@kungal/ui-vue'
const items: KunStepItem[] = [
  { title: '步骤一' },
  { title: '步骤二' },
  { title: '步骤三' },
]
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <KunSteps :items="items" :current="1" color="success" />
    <KunSteps :items="items" :current="1" color="warning" size="sm" />
  </div>
</template>
