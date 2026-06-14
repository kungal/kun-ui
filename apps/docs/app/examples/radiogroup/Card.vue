<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('pro')
const options: KunRadioOption[] = [
  { value: 'free', label: '免费版', description: '适合个人体验' },
  { value: 'pro', label: '专业版', description: '适合小型团队' },
  { value: 'team', label: '团队版', description: '适合企业协作' },
]
</script>

<template>
  <KunRadioGroup
    v-model="value"
    variant="card"
    color="secondary"
    label="订阅方案"
    :options="options"
  />
</template>
