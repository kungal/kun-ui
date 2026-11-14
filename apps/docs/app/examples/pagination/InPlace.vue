<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { demoTopicPage } from '../skeletonswap/topics'
import TopicRows from '../skeletonswap/TopicRows.vue'

const loadPage = (page: number) =>
  Array.from({ length: 6 }, (_, i) => demoTopicPage((page - 1) * 6 + i + 1)).flat()

const page = ref(1)
const topics = ref(loadPage(1))
const loading = ref(false)
const heading = ref<HTMLElement | null>(null)

const revealListStart = () => {
  const el = heading.value
  if (!el) return
  const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  if (el.getBoundingClientRect().top >= offset) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  el.focus({ preventScroll: true })
  el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
}

let request = 0
watch(page, (next) => {
  const current = ++request
  loading.value = true
  setTimeout(async () => {
    if (current !== request) return
    topics.value = loadPage(next)
    loading.value = false
    await nextTick()
    revealListStart()
  }, 700)
})
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <h3 ref="heading" tabindex="-1" class="scroll-mt-20 font-semibold outline-none">
      最新话题 · 第 {{ page }} 页
    </h3>
    <KunLoading :loading="loading" spinner>
      <KunCard bordered padding="md">
        <TopicRows :topics="topics" />
      </KunCard>
    </KunLoading>
    <KunPagination v-model:current-page="page" :total-page="5" :is-loading="loading" />
  </div>
</template>
