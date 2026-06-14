<script setup lang="ts">
import { ref } from 'vue'

// 有默认插槽时，KunLoading 作为遮罩层覆盖在内容之上，由 loading 控制显隐。
const loading = ref(true)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="loading = !loading">
      切换遮罩
    </KunButton>
    <KunLoading :loading="loading">
      <KunCard class-name="flex h-32 items-center justify-center">
        <span>被遮罩覆盖的内容</span>
      </KunCard>
    </KunLoading>
  </div>
</template>
