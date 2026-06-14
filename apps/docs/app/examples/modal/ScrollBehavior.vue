<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const paragraphs = Array.from({ length: 12 }, (_, i) => i + 1)
</script>

<template>
  <KunButton color="primary" @click="open = true">外部滚动</KunButton>

  <KunModal v-model="open" scroll-behavior="outside">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">滚动行为:outside</h3>
      <p class="text-default-600 text-sm">
        当内容超出视口时,<code>scrollBehavior="outside"</code>
        让整个遮罩层滚动;默认的 <code>inside</code> 则只滚动面板内部。
      </p>
      <p
        v-for="n in paragraphs"
        :key="n"
        class="text-default-600 text-sm"
      >
        第 {{ n }} 段内容,用于撑高对话框以演示滚动效果。
      </p>
      <KunButton color="primary" @click="open = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
