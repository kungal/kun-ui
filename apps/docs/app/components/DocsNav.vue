<script setup lang="ts">
// The sidebar nav list, shared by the desktop aside and the mobile drawer so
// there's one source of nav markup. Order/labels come from ~/nav.
import { nav } from '~/nav'
</script>

<template>
  <nav class="flex flex-col gap-6">
    <div v-for="section in nav" :key="section.title">
      <p
        class="text-default-400 mb-2 text-xs font-semibold tracking-wide uppercase"
      >
        {{ section.title }}
      </p>
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in section.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="text-default-600 hover:bg-default-100 hover:text-foreground block rounded-md px-2.5 py-1.5 text-sm transition-colors"
            active-class="!text-primary bg-primary/10 font-medium"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
