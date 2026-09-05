<script setup lang="ts">
import { ref } from 'vue'

// `precision` decides what one click commits and which grid the panel opens on.
// It is orthogonal to `mode`, so `range` + `month` is a month range. The emitted
// value is the first instant of the period, formatted to match: 'yyyy-MM-dd',
// 'yyyy-MM', 'yyyy'. The panel header zooms out from wherever it opened.
const day = ref<string | null>('2026-09-05')
const month = ref<string | null>('2026-09')
const year = ref<string | null>('2026')
const yearRange = ref<[string | null, string | null]>(['2018', '2024'])
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <KunDatePicker v-model="day" label="发售日" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ day ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker v-model="month" precision="month" label="收录月份" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ month ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker v-model="year" precision="year" label="出品年份" />
      <p class="text-default-500 mt-1 font-mono text-xs">{{ year ?? 'null' }}</p>
    </div>

    <div>
      <KunDatePicker
        v-model="yearRange"
        precision="year"
        mode="range"
        label="年代区间"
        :min-date="new Date(1995, 0, 1)"
      />
      <p class="text-default-500 mt-1 font-mono text-xs">
        {{ yearRange[0] ?? 'null' }} → {{ yearRange[1] ?? 'null' }}
      </p>
    </div>
  </div>
</template>
