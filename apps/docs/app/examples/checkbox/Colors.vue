<script setup lang="ts">
import { ref } from 'vue'
const value = ref(true)
</script>

<template>
  <div class="flex flex-col gap-2">
    <KunCheckBox v-model="value" color="default" label="default" />
    <KunCheckBox v-model="value" color="primary" label="primary" />
    <KunCheckBox v-model="value" color="secondary" label="secondary" />
    <KunCheckBox v-model="value" color="success" label="success" />
    <KunCheckBox v-model="value" color="warning" label="warning" />
    <KunCheckBox v-model="value" color="danger" label="danger" />
    <KunCheckBox v-model="value" color="info" label="info" />
  </div>
</template>
