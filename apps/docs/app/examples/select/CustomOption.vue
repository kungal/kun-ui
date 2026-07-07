<script setup lang="ts">
import { ref } from 'vue'

// Extra fields (avatar, desc) on top of the base option — the component is
// generic over the option shape, so they're typed inside the #option slot.
type UserOption = {
  value: string
  label: string
  avatar: string
  desc: string
}

const avatar = (initial: string, bg: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="${bg}"/><text x="20" y="27" font-size="18" fill="white" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`
  )

const value = ref<string>('kun')
const options: UserOption[] = [
  { value: 'kun', label: 'Kun', avatar: avatar('K', '#e11d48'), desc: '前端 · Vue' },
  { value: 'moe', label: 'Moe', avatar: avatar('M', '#2563eb'), desc: '设计' },
  { value: 'rin', label: 'Rin', avatar: avatar('R', '#16a34a'), desc: '后端 · Rust' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunSelect v-model="value" :options="options" label="Assignee">
      <!-- `option` is typed as UserOption — avatar/desc are available. -->
      <template #option="{ option }">
        <img :src="option.avatar" alt="" class="size-8 shrink-0 rounded-full" />
        <div class="min-w-0">
          <div class="truncate font-medium">{{ option.label }}</div>
          <div class="text-default-500 truncate text-xs">{{ option.desc }}</div>
        </div>
      </template>
    </KunSelect>
  </div>
</template>
