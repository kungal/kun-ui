<script setup lang="ts">
import { ref } from 'vue'

// 用 v-model:shattered 声明式地控制碎裂——像「带玻璃碎裂的 v-if」。
// keep-space 让原位保留占位,碎裂后周围布局不跳动。
const broken = ref(false)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" @click="broken = !broken">
      {{ broken ? '复原' : '打碎' }}
    </KunButton>

    <KunShatter v-model:shattered="broken" :pieces="30" keep-space>
      <div
        class="border-default-200 bg-content1 rounded-kun-lg flex w-64 flex-col gap-1 border p-4 shadow-sm select-none"
      >
        <p class="text-default-900 font-semibold">v-model 控制</p>
        <p class="text-default-500 text-sm">设 shattered = true 即碎裂,false 复原。</p>
      </div>
    </KunShatter>
  </div>
</template>
