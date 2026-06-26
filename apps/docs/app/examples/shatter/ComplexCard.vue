<script setup lang="ts">
import { ref } from 'vue'

// 一个「真实」的复杂组件:封面图 + 标题 + 评分 + 标签 + 简介 + 按钮。
// 点「打碎这张卡片」即把整张卡(连同里面的图片与文字)碎成玻璃片飞散。
const card = ref<{ shatter: () => void; restore: () => void } | null>(null)
const gone = ref(false)
const shatter = () => {
  card.value?.shatter()
  gone.value = true
}
const restore = () => {
  card.value?.restore()
  gone.value = false
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <KunShatter ref="card" :pieces="46" :duration="1200" :rotation="120">
      <article
        class="border-default-200 bg-content1 rounded-kun-xl w-[330px] overflow-hidden border shadow-lg"
      >
        <div class="relative h-40 w-full">
          <img
            src="/banner.webp"
            alt="cover"
            draggable="false"
            class="h-full w-full object-cover"
          />
          <span
            class="absolute top-3 left-3 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
          >
            Galgame
          </span>
          <span
            class="bg-warning absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          >
            NEW
          </span>
        </div>

        <div class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-default-900 truncate text-base font-semibold">星空下的约定</h3>
              <p class="text-default-500 text-xs">Studio Moonlit · 2026</p>
            </div>
            <KunRating :model-value="4" readonly size="sm" />
          </div>

          <div class="flex flex-wrap gap-1.5">
            <KunChip size="sm" color="primary" variant="flat">恋爱</KunChip>
            <KunChip size="sm" color="secondary" variant="flat">治愈</KunChip>
            <KunChip size="sm" variant="flat">校园</KunChip>
          </div>

          <p class="text-default-600 text-sm leading-relaxed">
            转学生在天文社遇见了她——一段关于星空、约定与离别的夏日物语,在蝉鸣声中悄然展开。
          </p>

          <KunButton size="sm" color="primary" class="w-full" @click="shatter">
            打碎这张卡片
          </KunButton>
        </div>
      </article>
    </KunShatter>

    <KunButton v-if="gone" size="sm" variant="flat" @click="restore">重新组合</KunButton>
  </div>
</template>
