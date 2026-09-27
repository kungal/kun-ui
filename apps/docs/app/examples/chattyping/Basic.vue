<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// Hand over typing notifications as they arrive, stamped with Date.now(). The
// component merges them per person and lets each lapse 6 s after it came — a
// client repeats its notification every 5 s while it keeps typing.
const events = ref<KunChatTypingEvent[]>([])
const type = (id: string) => (events.value = [...events.value, { user_id: id, at: Date.now() }])
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      <KunButton v-for="u in demoUsers.slice(1, 4)" :key="u.id" size="sm" variant="flat" @click="type(u.id)">
        {{ u.name }} 输入
      </KunButton>
    </div>
    <div class="bg-content1 border-default/20 flex min-h-12 flex-col justify-center gap-1 rounded-kun-lg border px-4 py-2 text-sm">
      <KunChatTyping :events="events" :users="demoUsers" kind="group" />
      <KunChatTyping :events="events" kind="direct" />
    </div>
  </div>
</template>
