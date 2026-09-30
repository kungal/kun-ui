<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoTime, demoUsers } from '~/utils/chatDemo'

// On a touch screen (try the phone width in devtools), swipe a row right for
// the leading actions and left for the trailing ones. What they do is the
// site's: `action` carries the key.
const haru = demoUsers[1]!
const last = demoMessage(haru.id, demoTime(0, '09:14'), '周末的线下聚会你去吗?')
const log = ref('')
</script>

<template>
  <div class="w-full bg-content1 border-default/20 flex max-w-md flex-col gap-2 rounded-kun-lg border p-1.5">
    <KunChatConversationItem
      :user="haru"
      :last-message="last"
      :unread-count="1"
      :time-zone="DEMO_TZ"
      :leading-actions="[{ key: 'read', label: '标为已读', icon: 'lucide:mail-open', color: 'primary' }]"
      :trailing-actions="[
        { key: 'mute', label: '静音', icon: 'lucide:bell-off', color: 'warning' },
        { key: 'pin', label: '置顶', icon: 'lucide:pin', color: 'success' },
        { key: 'archive', label: '归档', icon: 'lucide:archive', color: 'default' },
      ]"
      @action="(key) => (log = `action → ${key}`)"
    />
    <code class="text-foreground-muted px-2 text-xs">{{ log || '在触屏上左右滑动这一行' }}</code>
  </div>
</template>
