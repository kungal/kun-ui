<script setup lang="ts">
import { ref } from 'vue'
const shown = ref(true)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="shown = !shown">Toggle</KunButton>
    <KunFadeCard>
      <KunCard v-if="shown" color="primary" class-name="max-w-sm">
        Fades + expands in / out
      </KunCard>
    </KunFadeCard>
  </div>
</template>
