<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatTypingEvent } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// The back button shows below `md` only (`back="mobile"`, the default). The
// second line turns into "typing…" while a typing notification is live.
const haru = demoUsers[1]!
const typing = ref<KunChatTypingEvent[]>([])
const type = () => (typing.value = [{ user_id: haru.id, at: Date.now() }])
</script>

<template>
  <div class="w-full border-default/20 flex flex-col overflow-hidden rounded-kun-lg border">
    <KunChatHeader :user="haru" subtitle="最近在线" :typing="typing">
      <template #actions>
        <KunButton is-icon-only variant="light" aria-label="搜索">
          <KunIcon name="lucide:search" />
        </KunButton>
      </template>
    </KunChatHeader>
    <KunChatHeader
      title="Galgame 汉化交流 · 校对组"
      kind="group"
      :avatar="demoUsers[3]!.avatar"
      subtitle="4 位成员"
      :back="true"
    />
    <div class="p-3">
      <KunButton size="sm" variant="flat" @click="type">模拟对方正在输入(6 秒后消失)</KunButton>
    </div>
  </div>
</template>
