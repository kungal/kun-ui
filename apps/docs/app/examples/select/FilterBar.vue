<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// A filter bar, not a form: `fullWidth: false` lets each control size to its own
// label, `popupWidth: 'auto'` stops the list inheriting a 90px trigger, and
// `maxVisibleTags` decides whether the trigger shows chips, a `+N` badge, or
// just a count. The pill look itself is consumer CSS through `classNames`.
type Work = {
  title: string
  year: number
  platform: 'PC' | 'Switch' | 'PS5'
  status: '已完成' | '进行中' | '待校对'
  tags: string[]
}

const WORKS: Work[] = [
  { title: 'CLANNAD', year: 2004, platform: 'PC', status: '已完成', tags: ['催泪', '校园'] },
  { title: 'STEINS;GATE', year: 2009, platform: 'PC', status: '已完成', tags: ['科幻', '悬疑'] },
  { title: 'Summer Pockets', year: 2018, platform: 'Switch', status: '进行中', tags: ['夏天', '催泪'] },
  { title: 'Muv-Luv Alternative', year: 2006, platform: 'PC', status: '待校对', tags: ['科幻', '战斗'] },
  { title: '月姫 -A piece of blue glass moon-', year: 2021, platform: 'PS5', status: '进行中', tags: ['奇幻', '悬疑'] },
  { title: 'Little Busters!', year: 2007, platform: 'Switch', status: '已完成', tags: ['校园', '催泪'] },
]

const tagOptions: KunSelectOption[] = [
  { value: '催泪', label: '催泪' },
  { value: '校园', label: '校园' },
  { value: '科幻', label: '科幻' },
  { value: '悬疑', label: '悬疑' },
  { value: '奇幻', label: '奇幻' },
  { value: '夏天', label: '夏天' },
  { value: '战斗', label: '战斗' },
]
const platformOptions: KunSelectOption[] = [
  { value: 'PC', label: 'PC' },
  { value: 'Switch', label: 'Switch' },
  { value: 'PS5', label: 'PS5' },
]
const statusOptions: KunSelectOption[] = [
  { value: '已完成', label: '已完成' },
  { value: '进行中', label: '进行中' },
  { value: '待校对', label: '待校对' },
]

const tags = ref<string[]>(['催泪'])
const platforms = ref<string[]>([])
const status = ref<string | null>(null)

const pill = { trigger: 'border-dashed' }

const results = computed(() =>
  WORKS.filter(
    (w) =>
      (!tags.value.length || tags.value.some((t) => w.tags.includes(t))) &&
      (!platforms.value.length || platforms.value.includes(w.platform)) &&
      (!status.value || w.status === status.value)
  )
)

const reset = () => {
  tags.value = []
  platforms.value = []
  status.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <!-- maxVisibleTags 0: no chips at all, the trigger reads "标签 · 2" -->
      <KunSelect
        v-model="tags"
        :options="tagOptions"
        :multiple="true"
        :searchable="true"
        :full-width="false"
        :max-visible-tags="0"
        popup-width="auto"
        rounded="full"
        size="sm"
        icon="lucide:filter"
        placeholder="标签"
        :class-names="pill"
        aria-label="按标签筛选"
      />

      <!-- maxVisibleTags 1: one chip, the rest collapse into +N -->
      <KunSelect
        v-model="platforms"
        :options="platformOptions"
        :multiple="true"
        :full-width="false"
        :max-visible-tags="1"
        popup-width="auto"
        rounded="full"
        size="sm"
        placeholder="平台"
        :class-names="pill"
        aria-label="按平台筛选"
      />

      <KunSelect
        v-model="status"
        :options="statusOptions"
        :full-width="false"
        :clearable="true"
        popup-width="auto"
        rounded="full"
        size="sm"
        placeholder="状态"
        :class-names="pill"
        aria-label="按状态筛选"
      />

      <KunButton size="sm" variant="light" @click="reset">重置</KunButton>
    </div>

    <ul class="mt-4 space-y-2">
      <li
        v-for="work in results"
        :key="work.title"
        class="bg-content1 border-kun rounded-kun-lg flex items-center justify-between gap-3 border px-3 py-2"
      >
        <div class="min-w-0">
          <p class="truncate font-medium">{{ work.title }}</p>
          <p class="text-default-500 text-xs">
            {{ work.year }} · {{ work.platform }} · {{ work.tags.join('／') }}
          </p>
        </div>
        <KunChip size="sm" variant="flat">{{ work.status }}</KunChip>
      </li>
      <li v-if="!results.length" class="text-default-500 py-6 text-center text-sm">
        没有符合条件的作品
      </li>
    </ul>
  </div>
</template>
