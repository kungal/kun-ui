<script setup lang="ts">
import { ref } from 'vue'

// 换 icon + color 即可变成「顶 / 收藏」等不同表态。
const like = ref(false)
const likeN = ref(42)
const up = ref(true)
const upN = ref(7)
const star = ref(false)
const starN = ref(15)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction
      v-model="like"
      v-model:count="likeN"
      icon="lucide:heart"
      color="danger"
      label="点赞"
    />
    <KunReaction
      v-model="up"
      v-model:count="upN"
      icon="lucide:thumbs-up"
      color="primary"
      label="顶"
    />
    <KunReaction
      v-model="star"
      v-model:count="starN"
      icon="lucide:star"
      color="warning"
      label="收藏"
    />
  </div>
</template>
