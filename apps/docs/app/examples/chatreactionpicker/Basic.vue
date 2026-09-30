<script setup lang="ts">
import { ref } from 'vue'
import { demoReactions } from '~/utils/chatDemo'

// The vocabulary comes from `GET /v2/chat/reactions`: animated art where it
// has `image_url`, the native emoji otherwise. One reaction per person —
// choosing another replaces it, choosing it again removes it.
const current = ref<string | null>('heart')
const plain = demoReactions.slice(0, 8).map(({ image_url: _, ...r }) => r)
const plainCurrent = ref<string | null>(null)
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="bg-content1 border-default/20 max-w-sm rounded-kun-lg border p-2">
      <KunChatReactionPicker v-model="current" :options="demoReactions" :columns="7" />
    </div>
    <div class="bg-content1 border-default/20 max-w-sm rounded-kun-lg border p-2">
      <KunChatReactionPicker v-model="plainCurrent" :options="plain" />
    </div>
    <code class="text-foreground-muted text-xs">v-model: {{ current }} / {{ plainCurrent }}</code>
  </div>
</template>
