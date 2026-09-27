<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_TZ, demoMessage, demoReactions, demoTime, demoUsers } from '~/utils/chatDemo'

// Right-click the bubble (long-press on a touch screen). Which actions appear
// is the site's decision — its permissions, its time limits; custom items can
// sit beside the built-in ones. KunChatMessageList opens this for you.
const message = demoMessage('1002', demoTime(0, '09:14'), '周末的线下聚会你去吗?')
const menu = ref<{ x: number; y: number } | null>(null)
const reaction = ref<string | null>(null)
const log = ref('')
</script>

<template>
  <div class="w-full bg-default-100 flex flex-col gap-3 rounded-kun-lg p-3">
    <div @contextmenu.prevent="(e) => (menu = { x: e.clientX, y: e.clientY })">
      <KunChatBubble :message="message" :users="demoUsers" :time-zone="DEMO_TZ" />
    </div>
    <code class="text-default-500 text-xs">{{ log || '右键点击上面的消息' }}</code>
    <KunChatMessageMenu
      :visible="!!menu"
      :position="menu"
      :actions="['reply', 'copy', 'pin', { key: 'translate', label: '翻译', icon: 'lucide:external-link' }, 'report']"
      :reactions="demoReactions"
      :current-reaction="reaction"
      @select="(key) => (log = `select → ${key}`)"
      @react="(key) => ((reaction = key), (log = `react → ${key}`))"
      @close="menu = null"
    />
  </div>
</template>
