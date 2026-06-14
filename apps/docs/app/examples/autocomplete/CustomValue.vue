<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// allowCustomValue (default true) lets the field keep what the user typed even
// when it matches no option — handy for free-form tags / emails.
const value = ref('')
const options: KunAutocompleteOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="value"
      :options="options"
      label="Favourite colour (or type your own)"
      placeholder="Pick or type…"
      :allow-custom-value="true"
    />
    <p class="text-default-500 mt-2 text-sm">值: {{ value || '—' }}</p>
  </div>
</template>
