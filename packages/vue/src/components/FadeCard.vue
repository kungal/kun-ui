<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Fade + expand transition wrapper. The original used Nuxt's <ClientOnly>;
// here a `mounted` gate replicates it framework-neutrally — the Transition
// only renders on the client, so there's no SSR/hydration flash.
//
// Height animates via the grid `0fr → 1fr` trick (the wrapper is a grid whose
// single row collapses), not `max-height`: it never thrashes a fixed cap and
// never clips tall content the way the old `max-h-96` did.
defineOptions({ name: 'KunFadeCard' })

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <Transition
    v-if="isMounted"
    enter-active-class="kun-fade-expand"
    leave-active-class="kun-fade-expand"
    enter-from-class="kun-fade-collapsed"
    leave-to-class="kun-fade-collapsed"
  >
    <div class="grid grid-rows-[1fr] opacity-100">
      <div class="min-h-0 overflow-hidden">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.kun-fade-expand {
  transition:
    grid-template-rows var(--kun-dur-slow) var(--ease-kun-standard),
    opacity var(--kun-dur-slow) var(--ease-kun-standard);
}
.kun-fade-collapsed {
  grid-template-rows: 0fr !important;
  opacity: 0;
}
</style>
