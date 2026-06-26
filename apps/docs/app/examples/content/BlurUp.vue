<script setup lang="ts">
import { ref, computed } from 'vue'

// 正文里的图片是后端 markdown 渲染成的原始 <img>(经 v-html 注入,不是组件)。
// KunContent 内部会自动给带 data-thumbhash 的正文图加模糊占位:把解码出的 ThumbHash
// 画成图片自身的背景,真实图片加载完成后清除——零 DOM 改动,和灯箱/剧透共存。
// width/height 让浏览器原生按比例预留空间(消除加载抖动);两者都由后端随图一起吐出。
const key = ref(0)
const reload = () => (key.value += 1)

const html = computed(
  () =>
    '<p>后端把图片的宽高与 ThumbHash 直接写进标签,正文图便和封面一样享受占位:</p>' +
    `<img src="/banner.webp?c=${key.value}" width="1920" height="1080" loading="lazy" data-thumbhash="eBeCA4AmyAaYeIcLy20KVwg3inaCelc=" alt="banner" />` +
    '<p>宽高让浏览器按比例预留空间(不再加载跳动),ThumbHash 提供加载前的模糊预览。</p>'
)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunContent :key="key" :content="html" class-name="max-w-md" />
  </div>
</template>
