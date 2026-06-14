<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
]
</script>

<template>
  <KunAutocomplete
    v-model="value"
    :options="options"
    label="City"
    placeholder="Type a city…"
    :clearable="true"
    class-name="max-w-xs"
  />
</template>
