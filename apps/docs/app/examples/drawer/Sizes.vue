<script setup lang="ts">
import { ref } from 'vue'
import type { KunDrawerSize } from '@kungal/ui-vue'

const open = ref(false)
const size = ref<KunDrawerSize>('md')
const sizes: KunDrawerSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const openWith = (s: KunDrawerSize) => {
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

  <KunDrawer v-model="open" :size="size" :responsive="false" title="尺寸">
    <p class="text-default-600 text-sm">
      通过 <code>size</code> 控制面板尺寸(横向抽屉为宽度,纵向抽屉为高度),
      可选 sm / md / lg / xl / full。当前:{{ size }}。
    </p>
  </KunDrawer>
</template>
