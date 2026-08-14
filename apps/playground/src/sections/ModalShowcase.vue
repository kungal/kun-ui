<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const openLocked = ref(false)
const openCentered = ref(false)
const openForm = ref(false)
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
      <KunButton variant="bordered" @click="openCentered = true">
        placement="center"
      </KunButton>
      <KunButton variant="bordered" @click="openForm = true">
        Sheet with input
      </KunButton>
    </div>

    <KunModal v-model="open" title="Hello from KunModal">
      <div class="flex max-w-sm flex-col gap-3">
        <p class="text-default-600 text-sm">
          Backdrop click or Escape closes this. Tab focus stays trapped inside
          while open, and the body scroll is locked.
        </p>
        <KunButton color="primary" @click="open = false">Got it</KunButton>
      </div>
    </KunModal>

    <KunModal
      v-model="openLocked"
      :is-dismissable="false"
      title="Non-dismissable"
    >
      <div class="flex max-w-sm flex-col gap-3">
        <p class="text-default-600 text-sm">
          Backdrop click and Escape are disabled here — close with the button.
        </p>
        <KunButton color="danger" @click="openLocked = false">Close</KunButton>
      </div>
    </KunModal>

    <KunModal
      v-model="openCentered"
      placement="center"
      title="placement=&quot;center&quot;"
    >
      <div class="flex flex-col gap-3">
        <p class="text-default-600 text-sm">
          Opts out of the responsive sheet — centred at every width, the pre-2.19
          behaviour.
        </p>
        <KunButton color="primary" @click="openCentered = false">Close</KunButton>
      </div>
    </KunModal>

    <KunModal v-model="openForm" title="Sheet with an input">
      <div class="flex flex-col gap-3">
        <p class="text-default-600 text-sm">
          On a phone, focusing this input opens the keyboard — the overlay should
          shrink to the visible viewport instead of hiding behind it.
        </p>
        <input
          class="border-kun rounded-kun-md bg-content1 px-3 py-2 text-sm"
          placeholder="Tap me on a phone"
        />
        <KunButton color="primary" @click="openForm = false">Close</KunButton>
      </div>
    </KunModal>
  </section>
</template>
