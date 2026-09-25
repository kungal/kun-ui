<script setup lang="ts">
import { ref } from 'vue'

const current = ref('home')
const unread = ref(3)

const open = (key: string) => {
  current.value = key
  if (key === 'messages') unread.value = 0
}
</script>

<template>
  <nav
    class="bg-content1 border-kun grid w-full max-w-sm grid-cols-4 gap-1 rounded-lg border p-1"
  >
    <KunNavItem
      label="首页"
      icon="lucide:home"
      :current="current === 'home'"
      stacked
      @click="open('home')"
    />
    <KunNavItem
      label="社区"
      icon="lucide:messages-square"
      :current="current === 'community'"
      stacked
      @click="open('community')"
    />
    <KunNavItem
      label="消息"
      :current="current === 'messages'"
      stacked
      @click="open('messages')"
    >
      <template #icon>
        <KunBadge :count="unread" size="sm">
          <KunIcon name="lucide:send" class-name="size-5" />
        </KunBadge>
      </template>
    </KunNavItem>
    <KunNavItem
      label="设置"
      icon="lucide:settings"
      :current="current === 'settings'"
      stacked
      @click="open('settings')"
    />
  </nav>
</template>
