<script setup lang="ts">
import { ref } from 'vue'

// Extra fields (avatar, desc) on top of the base option — the component is
// generic, so they're typed inside the #option slot.
type CityOption = {
  value: string
  label: string
  avatar: string
  desc: string
}

// A tiny self-contained SVG avatar (no network request).
const avatar = (initial: string, bg: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="${bg}"/><text x="20" y="27" font-size="18" fill="white" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`
  )

const value = ref('')
const options: CityOption[] = [
  { value: 'tokyo', label: '東京 Tokyo', avatar: avatar('東', '#e11d48'), desc: 'Japan · Kantō' },
  { value: 'osaka', label: '大阪 Osaka', avatar: avatar('大', '#2563eb'), desc: 'Japan · Kansai' },
  { value: 'kyoto', label: '京都 Kyoto', avatar: avatar('京', '#16a34a'), desc: 'Japan · Kansai' },
  { value: 'sapporo', label: '札幌 Sapporo', avatar: avatar('札', '#9333ea'), desc: 'Japan · Hokkaidō' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete v-model="value" :options="options" label="City" placeholder="Type a city…">
      <!-- `option` is typed as CityOption — avatar/desc are available. -->
      <template #option="{ option }">
        <img :src="option.avatar" alt="" class="size-8 shrink-0 rounded-full" />
        <div class="min-w-0">
          <div class="truncate font-medium">{{ option.label }}</div>
          <div class="text-default-500 truncate text-xs">{{ option.desc }}</div>
        </div>
      </template>
    </KunAutocomplete>
  </div>
</template>
