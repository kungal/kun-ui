<script setup lang="ts">
import { ref } from 'vue'
import type { KunDrawerPlacement } from '@kungal/ui-vue'

const open = ref(false)
const placement = ref<KunDrawerPlacement>('right')
const placements: KunDrawerPlacement[] = ['left', 'right', 'top', 'bottom']

const openWith = (p: KunDrawerPlacement) => {
  placement.value = p
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <KunButton
      v-for="p in placements"
      :key="p"
      variant="bordered"
      @click="openWith(p)"
    >
      {{ p }}
    </KunButton>
  </div>

  <KunDrawer
    v-model="open"
    :placement="placement"
    :responsive="false"
    title="方向"
  >
    <p class="text-default-600 text-sm">
      通过 <code>placement</code> 设置滑出方向,可选 left / right / top /
      bottom。当前:{{ placement }}。
    </p>
  </KunDrawer>
</template>
