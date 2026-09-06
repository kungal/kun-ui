<script setup lang="ts">
import { ref } from 'vue'
import type { KunContextMenuItem } from '@kungal/ui-vue'

const items: KunContextMenuItem[] = [
  { key: 'draft', label: '存为草稿', icon: 'lucide:download' },
  { key: 'schedule', label: '定时发布', icon: 'lucide:calendar' },
  { key: 'discard', label: '丢弃', icon: 'lucide:x', color: 'danger' },
]
const last = ref('')
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButtonGroup aria-label="发布">
      <KunButton color="primary" @click="last = '发布'">发布</KunButton>
      <KunDropdown :items="items" @select="(item) => (last = item.label)">
        <template #trigger>
          <KunButton color="primary" :is-icon-only="true" aria-label="更多发布选项">
            <KunIcon name="lucide:chevron-down" />
          </KunButton>
        </template>
      </KunDropdown>
    </KunButtonGroup>
    <p v-if="last" class="text-default-500 text-sm">上一次操作：{{ last }}</p>
  </div>
</template>
