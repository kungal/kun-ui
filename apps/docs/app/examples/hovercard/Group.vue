<script setup lang="ts">
import type { KunUser } from '@kungal/ui-vue'

const replies: { user: KunUser; joined: string; text: string }[] = [
  {
    user: { id: 42, name: '鲲', avatar: '/favicon.webp' },
    joined: '2019 年加入',
    text: '补丁已经更新到 1.2,之前存档不兼容的问题修好了。',
  },
  {
    user: { id: 7, name: 'KUN Galgame', avatar: '/kungalgame.webp' },
    joined: '2021 年加入',
    text: '感谢汉化组,周末就去通关。',
  },
  {
    user: { id: 103, name: '路过的旅人', avatar: '' },
    joined: '2024 年加入',
    text: '请问 Steam 版能直接用这个补丁吗?',
  },
]
</script>

<template>
  <ul class="w-full">
    <li
      v-for="reply in replies"
      :key="reply.user.id"
      class="border-kun flex gap-3 border-b py-3 last:border-b-0"
    >
      <KunHoverCard group="replies" position="right-start">
        <template #trigger>
          <KunAvatar :user="reply.user" />
        </template>

        <div class="flex w-60 items-center gap-3 p-3">
          <KunAvatar :user="reply.user" size="lg" :is-navigation="false" />
          <div class="min-w-0">
            <p class="truncate font-semibold">{{ reply.user.name }}</p>
            <p class="text-default-500 text-xs">{{ reply.joined }}</p>
          </div>
        </div>
      </KunHoverCard>
      <div class="min-w-0 text-sm">
        <p class="font-medium">{{ reply.user.name }}</p>
        <p class="text-default-600">{{ reply.text }}</p>
      </div>
    </li>
  </ul>
</template>
