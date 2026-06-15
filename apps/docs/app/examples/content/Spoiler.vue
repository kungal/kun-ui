<script setup lang="ts">
// 剧透:在受信任的 HTML 中,用 class="kun-spoiler kun-spoiler-hidden" 包裹
// 需要遮挡的内容,KunContent 会按文字形状(逐行、逐词按空格分隔)加上粒子
// 遮罩,点击即可揭示。
const html =
  '<p>剧透警告:<span class="kun-spoiler kun-spoiler-hidden">凶手其实是管家</span>(点击揭示)。</p>' +
  '<p>English: <span class="kun-spoiler kun-spoiler-hidden">the butler did it in the library</span> (click to reveal — each word is masked separately).</p>'
</script>

<template>
  <KunContent :content="html" />
</template>
