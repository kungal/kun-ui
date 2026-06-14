<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton variant="bordered" @click="open = true">不可关闭</KunButton>

  <KunDrawer v-model="open" title="不可关闭" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        设置 <code>:is-dismissable="false"</code> 后,点击背景和按下 Esc
        都不会关闭;头部的关闭按钮仍然有效。
      </p>
      <KunButton color="danger" @click="open = false">手动关闭</KunButton>
    </div>
  </KunDrawer>
</template>
