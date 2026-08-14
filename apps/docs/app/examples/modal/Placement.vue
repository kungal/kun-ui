<script setup lang="ts">
import { ref } from 'vue'

const auto = ref(false)
const top = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton color="primary" @click="auto = true">自适应(默认)</KunButton>
    <KunButton variant="bordered" @click="top = true">顶部对齐</KunButton>
  </div>

  <KunModal v-model="auto" title="自适应对齐">
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        默认值 <code>placement="auto"</code>:窄屏(<code>md</code> 以下)从底部
        升起、贴边铺满,更贴近手机的操作习惯;<code>md</code> 及以上恢复居中。
        把浏览器窗口拉窄再打开一次就能看到差别。
      </p>
      <p class="text-default-600 text-sm">
        需要在所有宽度都居中,传 <code>placement="center"</code>。
      </p>
      <KunButton color="primary" @click="auto = false">关闭</KunButton>
    </div>
  </KunModal>

  <KunModal v-model="top" placement="top" title="顶部对齐">
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        <code>placement="top"</code> 在所有宽度下都贴近视口顶部。
      </p>
      <KunButton color="primary" @click="top = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
