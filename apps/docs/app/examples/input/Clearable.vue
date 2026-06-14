<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Clear me')
const password = ref('')
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <KunInput
      v-model="text"
      label="可清除"
      placeholder="Type something…"
      is-clearable
    />
    <KunInput
      v-model="password"
      type="password"
      label="密码"
      placeholder="••••••••"
      reveal-password
    />
  </div>
</template>
