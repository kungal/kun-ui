<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { nav } from '~/nav'

// Per-route page title derived from the path, so each page gets
// "Button · KunUI" etc. with no per-page boilerplate; "/" → just "KunUI".
const route = useRoute()
const pageTitle = computed(() => {
  if (route.path === '/') return ''
  const seg = route.path.split('/').filter(Boolean).pop() ?? ''
  return seg.charAt(0).toUpperCase() + seg.slice(1)
})
useHead({
  title: pageTitle,
  titleTemplate: (t) => (t ? `${t} · KunUI` : 'KunUI'),
})

// Dark mode: KunUI's `dark:` variant keys off `.kun-dark-mode` on <html>.
const dark = ref(false)
watchEffect(() => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('kun-dark-mode', dark.value)
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Top bar — built from KunUI components (dogfooding). -->
    <header
      class="border-default-200 bg-background/80 z-kun-sticky sticky top-0 flex items-center justify-between border-b px-5 py-3 backdrop-blur"
    >
      <NuxtLink to="/" class="flex items-center gap-2">
        <KunFavicon class="size-7" />
        <span class="text-lg font-bold">Kun<span class="text-primary">UI</span></span>
        <KunChip size="sm" color="primary">Docs</KunChip>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <KunLink href="https://github.com/kungal/kun-ui" target="_blank" color="default">
          GitHub
        </KunLink>
        <KunButton
          size="sm"
          variant="bordered"
          color="secondary"
          @click="dark = !dark"
        >
          {{ dark ? '🌙 Dark' : '☀️ Light' }}
        </KunButton>
      </div>
    </header>

    <div class="mx-auto flex max-w-7xl">
      <!-- Sidebar -->
      <aside
        class="border-default-200 sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r p-4 md:block"
      >
        <nav class="flex flex-col gap-6">
          <div v-for="section in nav" :key="section.title">
            <p class="text-default-400 mb-2 text-xs font-semibold tracking-wide uppercase">
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
      </aside>

      <!-- Content -->
      <main class="min-w-0 flex-1 px-6 py-10 lg:px-10">
        <NuxtPage />
      </main>
    </div>

    <!-- Overlay providers (the docs use toasts in demos). -->
    <KunMessageProvider />
    <KunAlertProvider />
    <KunLoliProvider />
  </div>
</template>
