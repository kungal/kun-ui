<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div class="border-default-200 bg-background w-full overflow-hidden rounded-lg border">
    <KunBanner
      v-model="open"
      icon="lucide:info"
      text="论坛将于 9 月 28 日 02:00–04:00 停机维护,期间无法发帖和上传图片。"
    />
    <header class="border-default-200 flex items-center justify-between border-b px-4 py-3">
      <span class="font-bold">Kun<span class="text-primary">Gal</span></span>
      <nav class="text-default-500 flex gap-4 text-sm">
        <span>话题</span><span>Galgame</span><span>排行</span>
      </nav>
    </header>
    <div class="flex items-center justify-between gap-3 p-4 text-sm">
      <p class="text-default-600">点右侧的 × 关闭横幅,下面的内容会平滑上移。</p>
      <KunButton v-if="!open" size="sm" variant="flat" @click="open = true">
        重新显示
      </KunButton>
    </div>
  </div>
</template>
