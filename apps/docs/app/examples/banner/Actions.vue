<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <!-- actions 插槽拿到 dismiss:点"去投票"也会关闭横幅(并触发 close)。 -->
    <KunBanner v-model="open" color="primary" variant="flat">
      2026 年度 Galgame 投票开始了,<a href="#">查看规则</a>。
      <template #actions="{ dismiss }">
        <KunButton size="xs" color="primary" @click="dismiss">去投票</KunButton>
      </template>
    </KunBanner>
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">横幅里的链接自动沿用横幅的文字颜色并加下划线。</p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
