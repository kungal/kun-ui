<script setup lang="ts">
import { ref, computed } from 'vue'
import { registerKunIcon } from '@kungal/ui-core'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

// Self-contained icons (no fetch): a filled heart + star, coloured via currentColor.
registerKunIcon('custom:heart', {
  body: '<path fill="currentColor" d="M12 21s-6.7-4.4-9.3-8.6C.9 9.3 2.6 5.5 6.2 5.5c2 0 3.4 1.2 5.8 3.7C14.4 6.7 15.8 5.5 17.8 5.5c3.6 0 5.3 3.8 3.5 6.9C18.7 16.6 12 21 12 21Z"/>',
})
registerKunIcon('custom:star', {
  body: '<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
})

// 点赞 — a plain toggle.
const liked = ref(false)
const likeCount = ref(342)

// 收藏 — a controlled "menu button": its click opens the 收藏夹 picker, and its
// filled skin reflects membership in ≥1 list (not a self-toggle).
const lists = ref<string[]>([])
const listOptions = ref<KunCheckBoxGroupOption[]>([
  { value: 'favorites', label: '默认收藏夹' },
  { value: 'galgame', label: 'Galgame 精选', description: '12 项' },
  { value: 'later', label: '稍后再玩', description: '4 项' },
])
const collected = computed(() => lists.value.length > 0)
const favCount = computed(() => 88 + (collected.value ? 1 : 0))

const creating = ref(false)
const newList = ref('')
const createList = () => {
  const name = newList.value.trim()
  if (!name || listOptions.value.some((o) => o.value === name)) return
  listOptions.value.push({ value: name, label: name })
  lists.value.push(name)
  newList.value = ''
  creating.value = false
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Reaction — 点赞 vs 收藏(带收藏夹)</h2>
    <p class="text-default-500 max-w-2xl text-sm">
      点赞和收藏是对等的反应(同一种皮肤)。点赞直接 toggle;收藏是一个<strong>受控的
      menu-button</strong> —— 点击它弹出收藏夹选择器,填充态反映「是否在 ≥1
      个收藏夹里」(B 站 / YouTube 的做法),不需要 split button。
    </p>

    <!-- One item's action row: like + favorite look identical. -->
    <div class="border-kun rounded-kun-lg flex w-fit items-center gap-1 border p-2">
      <KunReaction
        v-model="liked"
        v-model:count="likeCount"
        icon="custom:heart"
        color="danger"
        label="点赞"
      >
        点赞
      </KunReaction>

      <KunPopover position="bottom-start" rounded="lg" opaque>
        <template #trigger>
          <KunReaction
            :toggle="false"
            :model-value="collected"
            :count="favCount"
            icon="custom:star"
            color="warning"
            :label="collected ? '已收藏' : '收藏'"
          >
            {{ collected ? '已收藏' : '收藏' }}
          </KunReaction>
        </template>

        <div class="w-60 space-y-2 p-1">
          <p class="px-2 pt-1 text-sm font-medium">添加到收藏夹</p>
          <KunCheckBoxGroup
            v-model="lists"
            :options="listOptions"
            color="warning"
            class-name="px-1"
          />
          <KunDivider />
          <KunButton
            v-if="!creating"
            variant="light"
            :full-width="true"
            class-name="justify-start"
            @click="creating = true"
          >
            <KunIcon name="lucide:plus" class="mr-1" /> 创建收藏夹
          </KunButton>
          <div v-else class="flex items-center gap-2 px-1">
            <KunInput
              v-model="newList"
              placeholder="收藏夹名称"
              size="sm"
              @keydown.enter="createList"
            />
            <KunButton size="sm" color="primary" @click="createList">
              创建
            </KunButton>
          </div>
        </div>
      </KunPopover>
    </div>

    <p class="text-default-500 text-sm">
      点赞: {{ liked ? '已赞' : '未赞' }} ({{ likeCount }}) · 已收藏到:
      {{ lists.length ? lists.join(', ') : '（未收藏）' }}
    </p>

    <h3 class="mt-2 text-base font-medium">Standalone toggles</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunReaction icon="custom:heart" color="danger" :count="12">Like</KunReaction>
      <KunReaction icon="custom:star" color="warning" :count="5">Star</KunReaction>
      <KunReaction icon="custom:heart" color="secondary" />
      <KunReaction :toggle="false" icon="lucide:upload" color="primary">分享</KunReaction>
    </div>
  </section>
</template>
