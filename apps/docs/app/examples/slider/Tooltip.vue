<script setup lang="ts">
import { ref } from 'vue'

// `showValue` renders the current value beside the label; `showTooltip` shows
// a bubble above the thumb while dragging or focused.
const v = ref(40)
</script>

<template>
  <div class="w-full max-w-md">
    <KunSlider
      v-model="v"
      label="音量"
      :show-value="true"
      :show-tooltip="true"
    />
  </div>
</template>
