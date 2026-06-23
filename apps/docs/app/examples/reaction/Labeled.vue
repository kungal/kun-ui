<script setup lang="ts">
import { ref } from 'vue'

// 默认插槽 = 可见文字 label,渲染在按钮内部,所以点图标 / 文字 / 计数任意处都切换。
const favGame = ref(false)
const favRes = ref(true)
const likes = ref(128)
const liked = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunReaction v-model="favGame" icon="lucide:star" color="warning">
      {{ favGame ? '已收藏' : '收藏游戏' }}
    </KunReaction>

    <KunReaction v-model="favRes" icon="lucide:bookmark" color="primary">
      {{ favRes ? '已收藏' : '收藏资源' }}
    </KunReaction>

    <!-- label + 计数也可以一起 -->
    <KunReaction v-model="liked" v-model:count="likes">点赞</KunReaction>
  </div>
</template>
