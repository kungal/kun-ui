<script setup lang="ts">
import { ref } from 'vue'
import type { KunUser } from '@kungal/ui-vue'

const user: KunUser = { id: 42, name: '鲲', avatar: '/favicon.webp' }
const following = ref(false)
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <KunHoverCard>
      <template #trigger>
        <KunUserChip :user="user" />
      </template>

      <div class="w-72 space-y-3 p-4">
        <div class="flex items-center gap-3">
          <KunAvatar :user="user" size="lg" :is-navigation="false" />
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ user.name }}</p>
            <p class="text-default-500 text-xs">2019 年加入 · 管理员</p>
          </div>
          <KunButton
            size="sm"
            :variant="following ? 'flat' : 'solid'"
            @click="following = !following"
          >
            {{ following ? '已关注' : '关注' }}
          </KunButton>
        </div>
        <p class="text-default-600 text-sm">
          写 galgame 攻略和补丁,偶尔修 bug。
        </p>
        <div class="border-kun grid grid-cols-3 border-t pt-3 text-center">
          <div>
            <p class="font-semibold">128</p>
            <p class="text-default-500 text-xs">话题</p>
          </div>
          <div>
            <p class="font-semibold">2,301</p>
            <p class="text-default-500 text-xs">回复</p>
          </div>
          <div>
            <p class="font-semibold">12,480</p>
            <p class="text-default-500 text-xs">萌萌点</p>
          </div>
        </div>
      </div>
    </KunHoverCard>
    <span class="text-default-500">发布于 3 小时前</span>
  </div>
</template>
