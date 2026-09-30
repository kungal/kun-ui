<script setup lang="ts">
import { ref } from 'vue'
import type { KunChatRequestAction } from '@kungal/ui-vue'
import { demoUsers } from '~/utils/chatDemo'

// A conversation from someone outside your inbox rule (you do not follow
// them) arrives as a request. Deleting it does not tell them; until you accept,
// they cannot see whether you have read it.
const loading = ref<KunChatRequestAction | null>(null)
const result = ref('')
const run = (action: KunChatRequestAction) => {
  loading.value = action
  setTimeout(() => {
    loading.value = null
    result.value = `${action} 完成`
  }, 900)
}
</script>

<template>
  <div class="w-full border-default/20 overflow-hidden rounded-kun-lg border">
    <KunChatRequestBar
      :user="demoUsers[2]"
      :loading="loading"
      @accept="run('accept')"
      @delete="run('delete')"
      @block="run('block')"
      @report="run('report')"
    />
    <p class="text-foreground-muted p-3 text-xs">{{ result || '选一个操作' }}</p>
  </div>
</template>
