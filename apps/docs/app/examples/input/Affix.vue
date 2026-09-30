<script setup lang="ts">
import { ref } from 'vue'
const search = ref('')
const amount = ref('')
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <KunInput v-model="search" placeholder="Search…" description="带前缀图标">
      <template #prefix>
        <KunIcon name="lucide:search" class="text-foreground-muted size-4" />
      </template>
    </KunInput>
    <KunInput v-model="amount" placeholder="0.00" description="带后缀单位">
      <template #prefix>
        <span class="text-foreground-muted text-sm">$</span>
      </template>
      <template #suffix>
        <span class="text-foreground-muted text-sm">USD</span>
      </template>
    </KunInput>
  </div>
</template>
