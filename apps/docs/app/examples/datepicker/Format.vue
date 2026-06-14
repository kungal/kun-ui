<script setup lang="ts">
import { ref } from 'vue'
const date = ref('')

// 仅允许选择今天及以后的工作日
const today = new Date()
today.setHours(0, 0, 0, 0)
const isDateDisabled = (d: Date) => {
  const day = d.getDay()
  return d < today || day === 0 || day === 6
}
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker
      v-model="date"
      label="自定义格式与禁用日期"
      format="yyyy 年 MM 月 dd 日"
      :is-date-disabled="isDateDisabled"
    />
    <p class="text-default-600 mt-2 text-sm">Value: {{ date || '—' }}</p>
    <p class="text-default-400 text-xs">已禁用过去的日期、周六与周日</p>
  </div>
</template>
