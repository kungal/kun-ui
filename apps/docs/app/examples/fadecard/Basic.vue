<script setup lang="ts">
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="show = !show">
      {{ show ? '收起' : '展开' }}
    </KunButton>
    <KunFadeCard>
      <KunCard v-if="show" color="primary" class-name="max-w-sm">
        淡入淡出 + 高度展开过渡
      </KunCard>
    </KunFadeCard>
  </div>
</template>
