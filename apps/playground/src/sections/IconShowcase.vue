<script setup lang="ts">
import { registerKunIcon } from '@kungal/core'

// All icons below are BUNDLED in @kungal/core — they render inline, offline,
// with zero setup and no network fetch. These are the icons KunUI's own
// components use.
const bundled = [
  'lucide:x',
  'lucide:check',
  'lucide:info',
  'lucide:circle-check',
  'lucide:circle-x',
  'lucide:triangle-alert',
  'lucide:chevron-right',
  'lucide:arrow-right',
  'lucide:download',
  'lucide:copy',
  'lucide:calendar',
  'svg-spinners:90-ring-with-bg',
]

// Consumer pattern: register your own icons (custom SVG, or data extracted
// from @iconify-json/* at build time). Body uses currentColor. Idempotent.
registerKunIcon('custom:heart', {
  body: '<path fill="currentColor" d="M12 21s-6.7-4.4-9.3-8.6C.9 9.3 2.6 5.5 6.2 5.5c2 0 3.4 1.2 5.8 3.7C14.4 6.7 15.8 5.5 17.8 5.5c3.6 0 5.3 3.8 3.5 6.9C18.7 16.6 12 21 12 21Z"/>',
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Icon (bundled, no fetch)</h2>
    <p class="text-default-500 text-sm">
      Rendered inline from <code>@kungal/core</code> — no Iconify API call,
      works offline. The spinner animates.
    </p>

    <div class="flex flex-wrap items-center gap-5 text-2xl">
      <KunIcon v-for="name in bundled" :key="name" :name="name" />
    </div>

    <h3 class="mt-2 text-base font-medium">Inherits text color</h3>
    <div class="flex flex-wrap items-center gap-5 text-2xl">
      <span class="text-primary"><KunIcon name="lucide:info" /></span>
      <span class="text-success"><KunIcon name="lucide:circle-check" /></span>
      <span class="text-danger"><KunIcon name="lucide:circle-x" /></span>
      <span class="text-warning"><KunIcon name="lucide:triangle-alert" /></span>
    </div>

    <h3 class="mt-2 text-base font-medium">
      Consumer-registered icon (<code>registerKunIcon</code>)
    </h3>
    <div class="flex flex-wrap items-center gap-5 text-2xl">
      <span class="text-secondary"><KunIcon name="custom:heart" /></span>
      <span class="text-default-500 self-center text-sm"
        >registered in &lt;script setup&gt;, no fetch</span
      >
    </div>
  </section>
</template>
