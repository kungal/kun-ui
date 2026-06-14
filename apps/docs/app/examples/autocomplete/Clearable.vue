<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `clearable` shows a button to reset the field text once it is non-empty.
const value = ref('東京 Tokyo')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="value"
      :options="options"
      label="City"
      placeholder="Type a city…"
      :clearable="true"
    />
  </div>
</template>
