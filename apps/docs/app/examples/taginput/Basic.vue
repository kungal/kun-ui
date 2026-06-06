<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['vue', 'nuxt'])
</script>

<template>
  <KunTagInput
    v-model="tags"
    label="Tags"
    placeholder="Add a tag, press Enter…"
    :max-tags="8"
    show-counter
    class-name="max-w-md"
  />
</template>
