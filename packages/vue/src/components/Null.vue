<script setup lang="ts">
import { getRandomSticker } from '@kungal/core'
import KunImage from './Image.vue'
import type { KunNullProps } from './types'

// Empty-state placeholder with a deterministic sticker (stable per
// `description`). The sticker comes from the KunUI CDN — see
// getRandomSticker in @kungal/core.
defineOptions({ name: 'KunNull' })

withDefaults(defineProps<KunNullProps>(), {
  description: '请填满这只萝莉吧, 因为这里空空如也',
  isShowSticker: true,
})
</script>

<template>
  <div class="m-auto flex flex-col items-center gap-3">
    <KunImage
      v-if="isShowSticker"
      :src="getRandomSticker(description || '')"
      class-name="h-32 w-32 rounded-2xl"
      loading="lazy"
      alt="blank galgame"
    />
    <span>{{ description }}</span>
  </div>
</template>
