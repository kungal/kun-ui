<script setup lang="ts">
import { ref } from 'vue'
import type { KunModalSize } from '@kungal/ui-vue'

const open = ref(false)
const size = ref<KunModalSize>('md')
const sizes: KunModalSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const openWith = (s: KunModalSize) => {
  size.value = s
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton
      v-for="s in sizes"
      :key="s"
      variant="bordered"
      @click="openWith(s)"
    >
      {{ s }}
    </KunButton>
  </div>

  <KunModal
    v-model="open"
    :size="size"
    :title="`尺寸:${size}`"
    description="通过 size 控制面板的最大宽度,可选 sm / md / lg / xl / full。"
  >
    <KunButton color="primary" @click="open = false">关闭</KunButton>
  </KunModal>
</template>
