<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const value = ref(['cg'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'cg', label: 'CG 包' },
  { value: 'bgm', label: 'BGM' },
  { value: 'voice', label: '语音', disabled: true, description: '本作无语音' },
]
const off = ref(['bgm'])
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunCheckBoxGroup v-model="value" :options="options" label="单个选项禁用" />
    <KunCheckBoxGroup v-model="off" :options="options" label="整组禁用" :disabled="true" />
  </div>
</template>
