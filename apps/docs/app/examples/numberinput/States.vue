<script setup lang="ts">
import { ref } from 'vue'

// `error` shows a danger message + tints the control; `isInvalid` only tints.
// `disabled` blocks all input; `readonly` shows the value but prevents edits.
const v = ref<number | null>(5)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <KunNumberInput
      v-model="v"
      label="错误"
      :min="0"
      error="数量超出库存"
    />
    <KunNumberInput
      v-model="v"
      label="无效 (isInvalid)"
      :min="0"
      :is-invalid="true"
    />
    <KunNumberInput v-model="v" label="禁用" :min="0" :disabled="true" />
    <KunNumberInput v-model="v" label="只读" :min="0" :readonly="true" />
  </div>
</template>
