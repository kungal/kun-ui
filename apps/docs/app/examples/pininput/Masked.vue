<script setup lang="ts">
import { ref } from 'vue'

// `mask` hides each filled cell behind a • (e.g. a security PIN). `type="text"`
// allows letters; the default 'numeric' restricts to digits + numeric keypad.
const pin = ref('')
</script>

<template>
  <KunPinInput v-model="pin" :length="4" :mask="true" color="secondary" />
</template>
