<template>
  <!-- With an `href`, KunButton renders as a link (NuxtLink under the Nuxt
       layer, a native <a> in a plain Vue app). -->
  <KunButton color="primary" href="/components/button">Internal link</KunButton>
  <KunButton variant="bordered" href="https://github.com/kungal/kun-ui" target="_blank">
    External ↗
  </KunButton>
</template>
