<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <KunButton color="danger" @click="open = true">删除账户</KunButton>

  <KunModal v-model="open" role="alertdialog" :is-dismissable="false">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">确认删除?</h3>
      <p class="text-default-600 text-sm">
        设置 <code>role="alertdialog"</code> 将对话框标记为警告语义,
        适用于需要用户明确确认的破坏性操作。此例同时关闭了背景关闭。
      </p>
      <div class="flex justify-end gap-2">
        <KunButton variant="bordered" @click="open = false">取消</KunButton>
        <KunButton color="danger" @click="open = false">确认删除</KunButton>
      </div>
    </div>
  </KunModal>
</template>
