<script setup lang="ts">
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="a" type="single" color="success" label="单选外观（已选）" />
    <KunCheckBox v-model="b" type="single" color="primary" label="单选外观（未选）" />
  </div>
</template>
