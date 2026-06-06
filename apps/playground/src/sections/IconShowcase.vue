<script setup lang="ts">
// KunIcon renders @iconify/vue by default. Icon data is fetched from the
// Iconify API at runtime, so these need network the first time. The names
// use the standard Iconify "collection:name" form, unchanged from the
// Nuxt (@nuxt/icon) version.
const icons = [
  'lucide:heart',
  'lucide:star',
  'lucide:settings',
  'lucide:search',
  'lucide:check',
  'lucide:x',
  'svg-spinners:90-ring-with-bg',
]
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Icon (@iconify/vue default)</h2>

    <div class="flex flex-wrap items-center gap-5 text-2xl">
      <KunIcon v-for="name in icons" :key="name" :name="name" />
    </div>

    <h3 class="mt-2 text-base font-medium">Inherits text color</h3>
    <div class="flex flex-wrap items-center gap-5 text-2xl">
      <span class="text-primary"><KunIcon name="lucide:heart" /></span>
      <span class="text-success"><KunIcon name="lucide:check" /></span>
      <span class="text-danger"><KunIcon name="lucide:x" /></span>
      <span class="text-warning"><KunIcon name="lucide:star" /></span>
    </div>
  </section>
</template>
