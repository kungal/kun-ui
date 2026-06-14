<script setup lang="ts">
import { ref } from 'vue'
const page = ref(3)
</script>

<template>
  <KunPagination v-model:current-page="page" :total-page="20" :is-loading="true" />
</template>
