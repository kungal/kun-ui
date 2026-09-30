<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatFormattedText } from '@kungal/ui-vue'

// Type with the shortcuts — **粗体**、||剧透||、`代码`、```语言 代码块``` — and
// send: `send` carries the parsed text and entities, the input clears.
// Enter sends and Shift+Enter breaks the line; on a touch screen it is the
// other way round. Typing emits `typing` at most once every 5 s.
const draft = ref('周末去漫展吗?**上午十点** 地铁站 B 口集合,||我会 cos 白||')
const sent = ref<KunChatFormattedText | null>(null)
const typingAt = ref<string | null>(null)
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <pre
      v-if="sent"
      class="bg-default-100 max-h-48 overflow-auto p-3 text-xs"
    >{{ JSON.stringify(sent, null, 2) }}</pre>
    <p v-if="typingAt" class="text-foreground-muted px-3 pt-2 text-xs">typing 事件:{{ typingAt }}</p>
    <KunChatComposer
      v-model="draft"
      @send="(m) => (sent = m)"
      @typing="typingAt = new Date().toLocaleTimeString()"
    />
  </div>
</template>
