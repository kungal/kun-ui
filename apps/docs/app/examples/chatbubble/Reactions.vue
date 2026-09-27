<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoReactions, demoTime, demoUsers } from '~/utils/chatDemo'

// Reactions sit at the foot of the bubble; the viewer's own is filled. One per
// person: a click on another replaces yours, a click on yours removes it.
// `react` carries the new key (or null); applying it is the site's job.
const message = ref(
  demoMessage('1004', demoTime(0, '08:45'), '第三章校对完成,辛苦大家!', {
    reactions: [
      { reaction: 'party', count: 4, reacted: false },
      { reaction: 'heart', count: 3, reacted: true },
      { reaction: 'salute', count: 1, reacted: false },
    ],
  })
)
const react = (key: string | null) => {
  const reactions = message.value.reactions
    .map((r) => (r.reacted ? { ...r, count: r.count - 1, reacted: false } : r))
    .filter((r) => r.count > 0)
  const hit = reactions.find((r) => r.reaction === key)
  if (hit) Object.assign(hit, { count: hit.count + 1, reacted: true })
  else if (key) reactions.push({ reaction: key, count: 1, reacted: true })
  message.value = { ...message.value, reactions }
}
</script>

<template>
  <div class="w-full bg-default-100 rounded-kun-lg p-3">
    <KunChatBubble
      :message="message"
      :users="demoUsers"
      :reaction-options="demoReactions"
      :time-zone="DEMO_TZ"
      @react="react"
    />
  </div>
</template>
