<script setup lang="ts">
// Bridges KunImage's `imageComponent` slot to @nuxt/image. `<NuxtImg>` is a
// literal tag so Nuxt's compile-time component resolution applies; all props
// KunImage forwards (incl. provider/format/quality/... and @load/@error)
// arrive as $attrs and pass straight through.
defineOptions({ name: 'KunNuxtImg', inheritAttrs: false })
</script>

<template>
  <NuxtImg v-bind="$attrs" />
</template>
