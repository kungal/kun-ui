<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
const pageHref = (n: number) => `#/page/${n}`
</script>

<template>
  <KunPagination
    v-model:current-page="page"
    :total-page="20"
    :page-href="pageHref"
  />
</template>
