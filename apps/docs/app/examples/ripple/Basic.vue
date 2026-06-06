<script setup lang="ts">
// useRipple is auto-imported by the Nuxt layer.
const { ripples, onClick } = useRipple()
</script>

<template>
  <button
    class="bg-primary rounded-kun-lg relative overflow-hidden px-6 py-3 font-medium text-white"
    @click="onClick"
  >
    Click anywhere on me
    <KunRipple :ripples="ripples" />
  </button>
</template>
