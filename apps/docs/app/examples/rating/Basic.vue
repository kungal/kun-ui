<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(3)
</script>

<template>
  <div class="flex items-center gap-3">
    <KunRating v-model="rating" />
    <span class="text-default-500 text-sm">{{ rating }} / 5</span>
  </div>
</template>
