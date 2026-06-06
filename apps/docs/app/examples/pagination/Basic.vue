<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <div>
    <KunPagination v-model:current-page="page" :total-page="20" />
    <p class="text-default-600 mt-3 text-sm">Page: {{ page }}</p>
  </div>
</template>
