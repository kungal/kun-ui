<script setup lang="ts">
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="%237c3aed"/><text x="20" y="27" font-size="20" fill="%23fff" text-anchor="middle" font-family="sans-serif">K</text></svg>'
)}`
</script>

<template>
  <!-- A `badge` chip sits after the name; `badgeColor` is any KunUIColor. -->
  <div class="flex flex-col gap-4">
    <KunBrand name="KunUI" :icon-src="logo" badge="Beta" badge-color="primary" />
    <KunBrand name="KunUI" :icon-src="logo" badge="Docs" badge-color="secondary" />
    <KunBrand name="KunUI" :icon-src="logo" badge="New" badge-color="success" />
  </div>
</template>
