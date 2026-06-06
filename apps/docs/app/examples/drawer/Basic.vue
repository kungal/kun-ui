<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">Open drawer</KunButton>
  <KunDrawer v-model="open" title="Drawer title">
    <p class="text-default-600">
      Slides in from the edge (set <code>placement</code>). Press Esc or click the
      backdrop to close.
    </p>
  </KunDrawer>
</template>
