<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DEMO_TZ,
  ME,
  demoReactions,
  demoUsers,
  makeGroupConversation,
  resolveDemoMedia,
} from '~/utils/chatDemo'

// A group: names on the first message of each run, the avatar beside the last,
// service messages as centred pills. Click the pinned bar to jump to the
// pinned message and see it flash.
const messages = ref(makeGroupConversation())
const pinned = computed(() => messages.value.filter((m) => m.pinned_at))
const list = ref<{ scrollToSeq: (seq: number) => boolean } | null>(null)
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <KunChatPinnedBar :messages="pinned" @jump="(seq) => list?.scrollToSeq(seq)" />
    <KunChatMessageList
      ref="list"
      class="bg-default-100 flex-1"
      kind="group"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :reaction-options="demoReactions"
      :resolve-media-url="resolveDemoMedia"
      :time-zone="DEMO_TZ"
    />
  </div>
</template>
