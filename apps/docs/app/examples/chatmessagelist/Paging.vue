<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import type { KunChatMessage } from '@kungal/ui-vue'
import { ME, demoUsers, makeHistory } from '~/utils/chatDemo'

// Paging both ways, as the API does it (`before_seq`, `after_seq`,
// `around_seq`). Scroll up: older pages arrive above you and the view does not
// move. "跳到第 5 条" loads a window around a message that is not loaded — the
// list is then detached from the newest message (`has-newer`), and the
// scroll-down button brings the newest page back.
const PAGE = 30
const history = shallowRef<KunChatMessage[]>([])
const loaded = ref<KunChatMessage[]>([])
const loadingOlder = ref(false)
const loadingNewer = ref(false)
const list = ref<{ scrollToSeq: (seq: number) => boolean; scrollToBottom: () => void } | null>(null)

const first = computed(() => loaded.value[0]?.seq ?? 0)
const last = computed(() => loaded.value[loaded.value.length - 1]?.seq ?? 0)
const hasOlder = computed(() => first.value > 1)
const hasNewer = computed(() => last.value < history.value.length)
const slice = (from: number, to: number) => history.value.filter((m) => m.seq >= from && m.seq <= to)

onMounted(() => {
  history.value = makeHistory(400)
  loaded.value = slice(history.value.length - PAGE + 1, history.value.length)
})

const later = (fn: () => void) => setTimeout(fn, 500)
const loadOlder = () => {
  loadingOlder.value = true
  later(() => {
    loaded.value = [...slice(first.value - PAGE, first.value - 1), ...loaded.value]
    loadingOlder.value = false
  })
}
const loadNewer = () => {
  loadingNewer.value = true
  later(() => {
    loaded.value = [...loaded.value, ...slice(last.value + 1, last.value + PAGE)]
    loadingNewer.value = false
  })
}
const jump = async (seq: number) => {
  if (list.value?.scrollToSeq(seq)) return
  loaded.value = slice(seq - PAGE / 2, seq + PAGE / 2)
  await nextTick()
  list.value?.scrollToSeq(seq)
}
const latest = async () => {
  loaded.value = slice(history.value.length - PAGE + 1, history.value.length)
  await nextTick()
  list.value?.scrollToBottom()
}
</script>

<template>
  <div class="w-full border-default/20 flex h-[30rem] flex-col overflow-hidden rounded-kun-lg border">
    <div class="border-default/20 flex items-center gap-2 border-b px-3 py-2 text-sm">
      <KunButton size="sm" variant="flat" @click="jump(5)">跳到第 5 条</KunButton>
      <span class="text-foreground-muted">已载入 seq {{ first }}–{{ last }},共 {{ history.length }} 条</span>
    </div>
    <KunChatMessageList
      ref="list"
      class="bg-default-100 flex-1"
      :messages="loaded"
      :users="demoUsers"
      :current-user-id="ME"
      :has-older="hasOlder"
      :has-newer="hasNewer"
      :loading-older="loadingOlder"
      :loading-newer="loadingNewer"
      @load-older="loadOlder"
      @load-newer="loadNewer"
      @jump="jump"
      @latest="latest"
    >
      <template #start>
        <p class="text-foreground-muted py-4 text-center text-xs">这是你们对话的开始</p>
      </template>
    </KunChatMessageList>
  </div>
</template>
