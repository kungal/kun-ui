<script setup lang="ts">
import { ref } from 'vue'

// 不传 count 就是纯切换(收藏 / 喜欢这类无需计数的场景)。
const liked = ref(false)
const fav = ref(true)
</script>

<template>
  <div class="flex items-center gap-4">
    <KunReaction v-model="liked" label="喜欢" />
    <KunReaction v-model="fav" icon="lucide:bookmark" color="primary" label="收藏" />
  </div>
</template>
