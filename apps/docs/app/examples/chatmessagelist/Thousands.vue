<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue'
import type { KunChatMessage } from '@kungal/ui-vue'
import { ME, demoReactions, demoUsers, makeHistory } from '~/utils/chatDemo'

// Three thousand messages in one list. Rows off screen skip layout and paint
// (`content-visibility: auto`), so scrolling stays smooth without a
// virtualisation library; the button reports how long the first render took.
const messages = shallowRef<KunChatMessage[]>([])
const took = ref<number | null>(null)

const load = async (count: number) => {
  const start = performance.now()
  messages.value = makeHistory(count)
  await nextTick()
  requestAnimationFrame(() => (took.value = Math.round(performance.now() - start)))
}
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <div class="border-default/20 flex items-center gap-2 border-b px-3 py-2 text-sm">
      <KunButton size="sm" variant="flat" @click="load(3000)">载入 3000 条</KunButton>
      <span v-if="took !== null" class="text-default-500">
        {{ messages.length }} 条,首次渲染 {{ took }} ms
      </span>
    </div>
    <KunChatMessageList
      class="bg-default-100 flex-1"
      :messages="messages"
      :users="demoUsers"
      :current-user-id="ME"
      :reaction-options="demoReactions"
    >
      <template #empty>点上面的按钮载入 3000 条消息</template>
    </KunChatMessageList>
  </div>
</template>
