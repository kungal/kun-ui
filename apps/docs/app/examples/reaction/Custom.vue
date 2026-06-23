<script setup lang="ts">
import { ref } from 'vue'

// #icon 插槽:任意字形(emoji / 图片 / SVG),可按 active 换;
// color:除调色板外,也接受任意 CSS 颜色(品牌色)——填充 / 弹跳 / 爆裂全跟着它走。
const pushed = ref(false)
const pushN = ref(233)
const loved = ref(true)
const loveN = ref(66)
</script>

<template>
  <div class="flex items-center gap-5">
    <!-- 「推」:emoji 自定义字形(选中前后不同)+ 品牌橙 -->
    <KunReaction v-model="pushed" v-model:count="pushN" color="#ff6a00" label="推">
      <template #icon="{ active }">
        <span class="leading-none">{{ active ? '🔥' : '➕' }}</span>
      </template>
    </KunReaction>

    <!-- 默认心形,只换任意品牌色(紫) -->
    <KunReaction v-model="loved" v-model:count="loveN" color="#8b5cf6" label="紫心" />
  </div>
</template>
