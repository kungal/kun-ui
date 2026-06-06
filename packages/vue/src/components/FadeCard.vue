<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Fade + expand transition wrapper. The original used Nuxt's <ClientOnly>;
// here a `mounted` gate replicates it framework-neutrally — the Transition
// only renders on the client, so there's no SSR/hydration flash.
defineOptions({ name: 'KunFadeCard' })

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <Transition
    v-if="isMounted"
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 max-h-0"
    enter-to-class="opacity-100 max-h-96"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 max-h-96"
    leave-to-class="opacity-0 max-h-0"
  >
    <slot />
  </Transition>
</template>
