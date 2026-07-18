<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

// Extra fields on the item (count / dirty) are typed inside the #tab slot,
// because KunTab is generic over the item shape.
type MailTab = KunTabItem & { count?: number; dirty?: boolean }

const tab = ref('inbox')
const items: MailTab[] = [
  { value: 'inbox', textValue: '收件箱', icon: 'lucide:inbox', count: 3 },
  { value: 'drafts', textValue: '草稿', dirty: true },
  { value: 'sent', textValue: '已发送' },
]
</script>

<template>
  <div class="max-w-md">
    <!-- The #tab slot renders custom tab content; compose a KunBadge for an
         unread count or an "unsaved" dot. The sliding indicator measures the
         button, so the wider tab is tracked automatically. -->
    <KunTab v-model="tab" :items="items" variant="light">
      <template #tab="{ item }">
        <KunIcon v-if="item.icon" :name="item.icon" />
        <span>{{ item.textValue }}</span>
        <KunBadge v-if="item.count" variant="count" :count="item.count" color="primary" />
        <KunBadge v-else-if="item.dirty" variant="dot" color="danger" />
      </template>
    </KunTab>
  </div>
</template>
