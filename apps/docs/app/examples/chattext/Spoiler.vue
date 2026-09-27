<script setup lang="ts">
import { parseKunChatMarkdown } from '@kungal/ui-vue'

// Covered in the server HTML already (no JS needed to hide it); one click
// uncovers every spoiler in the message, and the cover dissolves.
const message = parseKunChatMarkdown(
  '通关了!最后的反转是 ||列车长就是白本人||,而且 ||第三章那封信|| 早就暗示过了。'
)
</script>

<template>
  <div class="w-full bg-content1 border-default/20 rounded-kun-lg border p-4 text-[0.9375rem]">
    <KunChatText :text="message.text" :entities="message.entities" />
  </div>
</template>
