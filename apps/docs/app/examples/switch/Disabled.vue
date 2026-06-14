<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunSwitch v-model="on" disabled label="禁用（开启）" />
    <KunSwitch v-model="off" disabled label="禁用（关闭）" />
  </div>
</template>
