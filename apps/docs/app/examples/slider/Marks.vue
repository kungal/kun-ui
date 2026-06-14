<script setup lang="ts">
import { ref } from 'vue'
import type { KunSliderMark } from '@kungal/ui-vue'

// `marks` accepts a plain number[] (tick dots) or {value,label}[] (labelled).
const a = ref(50)
const b = ref(50)
const labelledMarks: KunSliderMark[] = [
  { value: 0, label: 'Min' },
  { value: 50, label: 'Mid' },
  { value: 100, label: 'Max' },
]
</script>

<template>
  <div class="grid w-full max-w-md gap-8">
    <div>
      <p class="text-default-600 mb-1 text-sm">number[] 刻度</p>
      <KunSlider v-model="a" :marks="[0, 25, 50, 75, 100]" />
    </div>
    <div>
      <p class="text-default-600 mb-1 text-sm">带标签的刻度</p>
      <KunSlider v-model="b" :marks="labelledMarks" />
    </div>
  </div>
</template>
