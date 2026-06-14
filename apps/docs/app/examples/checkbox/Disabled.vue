<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(true)
const unchecked = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="checked" disabled label="禁用（已选）" />
    <KunCheckBox v-model="unchecked" disabled label="禁用（未选）" />
  </div>
</template>
