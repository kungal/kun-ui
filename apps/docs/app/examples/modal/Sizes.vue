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

  <KunModal v-model="open" :size="size">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold">尺寸:{{ size }}</h3>
      <p class="text-default-600 text-sm">
        通过 <code>size</code> 控制面板的最大宽度,可选 sm / md / lg / xl /
        full。
      </p>
      <KunButton color="primary" @click="open = false">关闭</KunButton>
    </div>
  </KunModal>
</template>
