<script setup lang="ts">
import { ref } from 'vue'

// v-model = 点赞状态;v-model:count = 计数(组件点击时自动 ±1,可被服务端值覆盖)。
const liked = ref(false)
const count = ref(128)
</script>

<template>
  <KunReaction v-model="liked" v-model:count="count" />
</template>
