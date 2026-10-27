<script setup lang="ts">
import type { DemoTopic } from './topics'

defineProps<{ topics?: DemoTopic[] }>()
</script>

<template>
  <ul class="divide-default-200 divide-y">
    <template v-if="topics">
      <li v-for="topic in topics" :key="topic.id" class="flex items-center gap-3 py-3">
        <KunAvatar :user="topic.user" :is-navigation="false" />
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">{{ topic.title }}</p>
          <p class="text-default-500 text-sm">{{ topic.user.name }} · {{ topic.replies }} 条回复</p>
        </div>
      </li>
    </template>
    <template v-else>
      <li v-for="i in 3" :key="i" class="flex items-center gap-3 py-3">
        <KunSkeleton variant="circle" height="2rem" />
        <div class="min-w-0 flex-1">
          <KunSkeleton variant="text" :width="i === 2 ? '55%' : '75%'" class-name="font-medium" />
          <KunSkeleton variant="text" width="30%" class-name="text-sm" />
        </div>
      </li>
    </template>
  </ul>
</template>
