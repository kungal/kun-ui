<script setup lang="ts">
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
const ac = ref(3)
const bc = ref(88)
const cc = ref(1024)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction v-model="a" v-model:count="ac" size="sm" />
    <KunReaction v-model="b" v-model:count="bc" size="md" />
    <KunReaction v-model="c" v-model:count="cc" size="lg" />
  </div>
</template>
