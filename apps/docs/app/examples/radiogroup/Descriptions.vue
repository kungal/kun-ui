<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue', description: '渐进式 JavaScript 框架' },
  { value: 'react', label: 'React', description: '用于构建用户界面的库' },
  { value: 'solid', label: 'Solid', description: '简洁且高性能' },
]
</script>

<template>
  <KunRadioGroup v-model="value" label="带描述的选项" :options="options" />
</template>
