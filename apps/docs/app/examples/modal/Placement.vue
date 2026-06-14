<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="primary" @click="open = true">顶部对齐</KunButton>

  <KunModal v-model="open" placement="top">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">顶部对齐</h3>
      <p class="text-default-600 text-sm">
        设置 <code>placement="top"</code> 后,对话框会贴近视口顶部显示,
        默认值为 <code>center</code>(垂直居中)。
      </p>
      <KunButton color="primary" @click="open = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
