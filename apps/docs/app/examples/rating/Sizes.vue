<script setup lang="ts">
import { ref } from 'vue'
const sm = ref(3)
const md = ref(3)
const lg = ref(3)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunRating v-model="sm" size="sm" />
    <KunRating v-model="md" size="md" />
    <KunRating v-model="lg" size="lg" />
  </div>
</template>
