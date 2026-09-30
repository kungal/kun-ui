<script setup lang="ts">
import { ref } from 'vue'
import { ME, demoMessage, demoPhoto, demoTime } from '~/utils/chatDemo'

// Three pinned messages. The bar starts at the newest; each click emits `jump`
// for the one shown and moves on to the next older one, round and round.
const pinned = [
  demoMessage(ME, demoTime(3, '19:02'), '群规:聊剧情请把关键内容用 ||剧透|| 遮起来'),
  demoMessage('1004', demoTime(2, '20:10'), '', { media: demoPhoto('bg/bg1', 1920, 1080) }),
  demoMessage('1004', demoTime(0, '08:47'), '**第三章校对截止**:本周日晚 22:00'),
]
const log = ref<number[]>([])
</script>

<template>
  <div class="w-full border-default/20 flex flex-col overflow-hidden rounded-kun-lg border">
    <KunChatPinnedBar
      :messages="pinned"
      unpinnable
      @jump="(seq) => log.unshift(seq)"
      @unpin="(seq) => log.unshift(-seq)"
    />
    <p class="text-foreground-muted p-3 text-xs">
      jump → {{ log.length ? log.slice(0, 5).join(', ') : '点一下置顶条' }}
    </p>
  </div>
</template>
