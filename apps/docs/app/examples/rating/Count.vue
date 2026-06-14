<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(7)
</script>

<template>
  <div class="flex items-center gap-3">
    <KunRating v-model="rating" :max="10" />
    <span class="text-default-500 text-sm">{{ rating }} / 10</span>
  </div>
</template>
