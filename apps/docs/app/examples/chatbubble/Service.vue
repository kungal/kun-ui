<script setup lang="ts">
import { DEMO_TZ, ME, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// Service messages are centred pills, their sentence built from the action and
// the users. A message can also carry a cross-site context card.
const service = [
  demoMessage(ME, demoTime(0, '19:00'), '', { kind: 'service', service_action: { type: 'group_created', title: 'Galgame 汉化交流' } }),
  demoMessage(ME, demoTime(0, '19:01'), '', { kind: 'service', service_action: { type: 'members_added', user_ids: ['1002', '1003', '1004'] } }),
  demoMessage('1004', demoTime(0, '19:05'), '', { kind: 'service', service_action: { type: 'title_changed', title: '汉化交流 · 校对组' } }),
  demoMessage('1005', demoTime(0, '19:06'), '', { kind: 'service', service_action: { type: 'member_left' } }),
]
const withContext = demoMessage('1002', demoTime(0, '21:16'), '这个补丁的汉化是完整的吗?', {
  context: {
    site: 'moyu',
    kind: 'patch',
    id: '3021',
    title: '《星空鉄道とシロの旅》汉化补丁 v0.9',
    url: 'https://www.moyu.moe/patch/3021/introduction',
  },
})
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-2 rounded-kun-lg p-3">
    <KunChatBubble v-for="m in service" :key="m.id" :message="m" :users="demoUsers" :current-user-id="ME" />
    <KunChatBubble :message="withContext" :users="demoUsers" :time-zone="DEMO_TZ" />
  </div>
</template>
