<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// `color` themes the focus ring / accent of the field.
const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunAutocomplete v-model="value" :options="options" color="primary" label="primary" />
    <KunAutocomplete v-model="value" :options="options" color="secondary" label="secondary" />
    <KunAutocomplete v-model="value" :options="options" color="success" label="success" />
    <KunAutocomplete v-model="value" :options="options" color="warning" label="warning" />
    <KunAutocomplete v-model="value" :options="options" color="danger" label="danger" />
    <KunAutocomplete v-model="value" :options="options" color="info" label="info" />
  </div>
</template>
