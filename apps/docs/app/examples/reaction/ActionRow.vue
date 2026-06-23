<script setup lang="ts">
import { ref } from 'vue'

// One cohesive actions row, all KunReaction: 点赞 is a toggle (default);
// 评论 / 分享 / 更多 are `:toggle="false"` actions (no pressed state, no burst —
// just a tactile pop) handled with a native @click. Same compact skin throughout.
const liked = ref(false)
const likes = ref(128)
const shares = ref(12)
</script>

<template>
  <div class="flex items-center gap-1">
    <KunReaction v-model="liked" v-model:count="likes" label="点赞" />
    <KunReaction
      :toggle="false"
      :count="34"
      icon="lucide:message-circle"
      label="评论"
    />
    <KunReaction
      :toggle="false"
      :count="shares"
      icon="lucide:repeat-2"
      label="转发"
      @click="shares++"
    />
    <KunReaction :toggle="false" icon="lucide:ellipsis" label="更多" />
  </div>
</template>
