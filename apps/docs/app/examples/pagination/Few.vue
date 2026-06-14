<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <KunPagination v-model:current-page="page" :total-page="5" />
</template>
