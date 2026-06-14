<script setup lang="ts">
import { ref } from 'vue'

// `disabled` blocks all interaction; `error` turns the control danger-colored
// and shows a message below.
const v = ref(40)
</script>

<template>
  <div class="grid w-full max-w-md gap-8">
    <KunSlider v-model="v" label="禁用" :disabled="true" />
    <KunSlider v-model="v" label="错误" error="数值超出范围" />
  </div>
</template>
