<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `error` shows a message and marks the field invalid; `isInvalid` flags it
// invalid without a message. `disabled` blocks all interaction.
const a = ref('')
const b = ref('東京 Tokyo')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunAutocomplete
      v-model="a"
      :options="options"
      label="错误"
      placeholder="Type a city…"
      error="请选择一个有效城市"
    />
    <KunAutocomplete
      v-model="b"
      :options="options"
      label="禁用"
      :disabled="true"
    />
  </div>
</template>
