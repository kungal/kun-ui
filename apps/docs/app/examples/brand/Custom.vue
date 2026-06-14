<script setup lang="ts">
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="%237c3aed"/><text x="20" y="27" font-size="20" fill="%23fff" text-anchor="middle" font-family="sans-serif">K</text></svg>'
)}`
</script>

<template>
  <!-- `iconClass` and `nameClass` let you resize/restyle the logo and the name.
       `iconAlt` sets the logo's alt text for accessibility. -->
  <KunBrand
    name="KunUI"
    :icon-src="logo"
    icon-alt="KunUI 标志"
    icon-class="size-14 rounded-kun-lg"
    name-class="text-3xl font-bold"
  />
</template>
