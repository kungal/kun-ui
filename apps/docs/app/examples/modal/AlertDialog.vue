<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="danger" @click="open = true">删除账户</KunButton>

  <KunModal
    v-model="open"
    role="alertdialog"
    title="确认删除?"
    description="此操作不可撤销,账户下的全部数据都会被移除。"
  >
    <div class="flex flex-col gap-3">
      <p class="text-default-600 text-sm">
        <code>role="alertdialog"</code> 把对话框标记为警告语义,用于需要用户明确
        回答的破坏性操作。它同时让点击背景不再关闭对话框 — 落在遮罩上的一次点击
        不算一个回答;Esc 仍然可以取消,和 Radix / Reka 的 AlertDialog 一致。
      </p>
      <div class="flex justify-end gap-2">
        <KunButton variant="bordered" @click="open = false">取消</KunButton>
        <KunButton color="danger" @click="open = false">确认删除</KunButton>
      </div>
    </div>
  </KunModal>
</template>
