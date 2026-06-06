<script setup lang="ts">
// Thin wrapper that bridges KunUI's `iconComponent` slot to @nuxt/icon.
// `<Icon>` is a literal tag here, so Nuxt's compile-time component
// auto-import resolves it (a dynamic `:is="'Icon'"` would not). KunIcon
// renders this component and forwards `name`.
defineProps<{ name?: string }>()
</script>

<template>
  <Icon v-if="name" :name="name" />
</template>
