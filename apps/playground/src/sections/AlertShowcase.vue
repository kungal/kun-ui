<script setup lang="ts">
import { ref } from 'vue'
import { useKunAlert, useKunLoliInfo } from '@kungal/ui-vue'

const last = ref('—')

const confirm = async () => {
  const ok = await useKunAlert({
    title: '确认操作',
    message: '确定要删除吗?此操作不可撤销。',
  })
  last.value = ok ? 'confirmed' : 'cancelled'
}

const info = async () => {
  await useKunAlert({ title: '提示', message: '仅一个确定按钮', showCancel: false })
  last.value = 'acknowledged'
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Alert (confirm) &amp; Loli</h2>

    <div class="flex flex-wrap items-center gap-3">
      <KunButton color="danger" @click="confirm">Confirm dialog</KunButton>
      <KunButton variant="bordered" @click="info">Info dialog</KunButton>
      <span class="text-default-500 text-sm">result: {{ last }}</span>
    </div>

    <div>
      <KunButton color="secondary" @click="useKunLoliInfo('喵~ 这是 loli 弹窗 >_<', 4)">
        Show loli popup
      </KunButton>
      <p class="text-default-500 mt-1 text-xs">
        (the mascot image needs /alert/*.webp in the app's public dir)
      </p>
    </div>
  </section>
</template>
