<script setup lang="ts">
import { ref } from 'vue'
const accept = ref(false)
</script>

<template>
  <KunSwitch
    v-model="accept"
    label="启用双重验证"
    error="为了账号安全，请开启此选项"
  />
</template>
