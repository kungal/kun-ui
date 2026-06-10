<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from '#imports'
import { nav } from '~/nav'

// Per-route SEO — title, description, Open Graph, Twitter card, canonical —
// resolved from site.config (pageMeta) for every route. Reactive, so it
// updates on client-side navigation.
useKunSeoMeta()

// The home page is a full-width marketing landing (no sidebar); component
// pages keep the docs sidebar.
const route = useRoute()
const isHome = computed(() => route.path === '/')

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
        <img src="/favicon.webp" alt="KunUI" class="size-7 rounded-lg" />
        <span class="text-lg font-bold">Kun<span class="text-primary">UI</span></span>
      </NuxtLink>

      <div class="flex items-center gap-3 sm:gap-4">
        <!-- AI-friendly "copy this page as Markdown" control (every page). -->
        <CopyPage />
        <a
          href="https://github.com/kungal/kun-ui"
          target="_blank"
          rel="noopener"
          class="text-default-600 hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <KunIcon name="lucide:github" /> GitHub
        </a>
        <button
          type="button"
          class="text-default-600 hover:text-foreground cursor-pointer text-sm transition-colors"
          @click="dark = !dark"
        >
          {{ dark ? '🌙 深色' : '☀️ 浅色' }}
        </button>
      </div>
    </header>

    <div :class="isHome ? '' : 'mx-auto flex max-w-7xl'">
      <!-- Sidebar (hidden on the full-width home landing) -->
      <aside
        v-if="!isHome"
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
      <main :class="isHome ? 'min-w-0' : 'min-w-0 flex-1 px-6 py-10 lg:px-10'">
        <NuxtPage />
      </main>
    </div>

    <!-- Overlay providers (the docs use toasts in demos). -->
    <KunMessageProvider />
    <KunAlertProvider />
    <KunLoliProvider />
  </div>
</template>
