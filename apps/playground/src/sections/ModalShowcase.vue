<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const openLocked = ref(false)
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Modal</h2>
    <p class="text-default-500 text-sm">
      Teleported to body, focus-trapped, body-scroll-locked, Escape to close.
    </p>

    <div class="flex flex-wrap gap-2">
      <KunButton color="primary" @click="open = true">Open modal</KunButton>
      <KunButton variant="bordered" @click="openLocked = true">
        Non-dismissable
      </KunButton>
    </div>

    <KunModal v-model="open">
      <div class="flex max-w-sm flex-col gap-3">
        <h3 class="text-lg font-semibold">Hello from KunModal</h3>
        <p class="text-default-600 text-sm">
          Backdrop click or Escape closes this. Tab focus stays trapped inside
          while open, and the body scroll is locked.
        </p>
        <KunButton color="primary" @click="open = false">Got it</KunButton>
      </div>
    </KunModal>

    <KunModal v-model="openLocked" :is-dismissable="false">
      <div class="flex max-w-sm flex-col gap-3">
        <h3 class="text-lg font-semibold">Non-dismissable</h3>
        <p class="text-default-600 text-sm">
          Backdrop click and Escape are disabled here — close with the button.
        </p>
        <KunButton color="danger" @click="openLocked = false">Close</KunButton>
      </div>
    </KunModal>
  </section>
</template>
