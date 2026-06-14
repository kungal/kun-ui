<script setup lang="ts">
import { ref } from 'vue'

const openLocked = ref(false)
const openNoClose = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton variant="bordered" @click="openLocked = true">
      不可关闭背景
    </KunButton>
    <KunButton variant="bordered" @click="openNoClose = true">
      隐藏关闭按钮
    </KunButton>
  </div>

  <KunModal v-model="openLocked" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">不可关闭背景</h3>
      <p class="text-default-600 text-sm">
        设置 <code>:is-dismissable="false"</code> 后,点击背景和按下 Esc
        都不会关闭,只能通过按钮主动关闭。
      </p>
      <KunButton color="danger" @click="openLocked = false">关闭</KunButton>
    </div>
  </KunModal>

  <KunModal v-model="openNoClose" :is-show-close-button="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">隐藏关闭按钮</h3>
      <p class="text-default-600 text-sm">
        设置 <code>:is-show-close-button="false"</code> 隐藏右上角的关闭按钮,
        仍可点击背景或按 Esc 关闭。
      </p>
      <KunButton color="primary" @click="openNoClose = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
