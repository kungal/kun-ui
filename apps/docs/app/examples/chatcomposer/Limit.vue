<script setup lang="ts">
import { ref } from 'vue'

// The limit counts the parsed text, as the server does — shortcut markers are
// free. The counter appears for the last 200 characters and turns red past the
// limit, where sending is blocked.
const draft = ref(`${'这是一段很长的攻略。'.repeat(398)}**结尾**`)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatComposer v-model="draft" :max-rows="4" />
  </div>
</template>
