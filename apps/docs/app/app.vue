<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute } from '#imports'

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

// The sidebar is desktop-only; on mobile the nav lives in a slide-in drawer.
// Close it whenever the route changes (i.e. a nav link was tapped).
const mobileNavOpen = ref(false)
watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false
  }
)
</script>

<template>
  <div class="min-h-screen">
    <!-- Top bar — built from KunUI components (dogfooding). -->
    <header
      class="border-default-200 bg-[oklch(var(--background))] z-kun-sticky sticky top-0 flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 md:bg-background/80 md:backdrop-blur"
    >
      <div class="flex items-center gap-1.5">
        <!-- Mobile: open the nav drawer (the sidebar is hidden below md). -->
        <button
          v-if="!isHome"
          type="button"
          aria-label="打开导航菜单"
          class="text-default-600 hover:text-foreground -ml-1 inline-flex cursor-pointer items-center justify-center p-1 md:hidden"
          @click="mobileNavOpen = true"
        >
          <KunIcon name="lucide:menu" class="text-xl" />
        </button>
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/favicon.webp" alt="KunUI" class="size-7 rounded-lg" />
          <span class="text-lg font-bold"
            >Kun<span class="text-primary">UI</span></span
          >
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <SearchBox />
        <!-- AI-friendly "copy this page as Markdown" control (sm+ to save room). -->
        <span class="hidden sm:contents"><CopyPage /></span>
        <NuxtLink
          to="/playground"
          class="text-default-600 hover:text-foreground hidden items-center gap-1.5 text-sm transition-colors sm:flex"
          active-class="!text-primary"
        >
          <KunIcon name="lucide:flask-conical" /> Playground
        </NuxtLink>
        <a
          href="https://github.com/kungal/kun-ui"
          target="_blank"
          rel="noopener"
          class="text-default-600 hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <KunIcon name="lucide:github" />
          <span class="hidden sm:inline">GitHub</span>
        </a>
        <button
          type="button"
          aria-label="切换深色模式"
          class="text-default-600 hover:text-foreground shrink-0 cursor-pointer text-sm transition-colors"
          @click="dark = !dark"
        >
          {{ dark ? '🌙' : '☀️' }}<span class="hidden sm:inline">{{
            dark ? ' 深色' : ' 浅色'
          }}</span>
        </button>
      </div>
    </header>

    <div :class="isHome ? '' : 'mx-auto flex max-w-7xl'">
      <!-- Sidebar (desktop; hidden on the full-width home landing) -->
      <aside
        v-if="!isHome"
        class="border-default-200 sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r p-4 md:block"
      >
        <DocsNav />
      </aside>

      <!-- Content -->
      <main :class="isHome ? 'min-w-0' : 'min-w-0 flex-1 px-6 py-10 lg:px-10'">
        <NuxtPage />
      </main>
    </div>

    <!-- Mobile nav drawer -->
    <Teleport to="body">
      <Transition name="mnav">
        <div
          v-if="mobileNavOpen"
          class="z-kun-modal fixed inset-0 flex md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="导航菜单"
        >
          <div
            class="mnav-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
            @click="mobileNavOpen = false"
          />
          <aside
            class="mnav-panel bg-content1 border-kun shadow-kun-lg relative h-full w-72 max-w-[80vw] overflow-y-auto border-r p-4"
          >
            <div class="mb-4 flex items-center justify-between">
              <span class="text-lg font-bold"
                >Kun<span class="text-primary">UI</span></span
              >
              <button
                type="button"
                aria-label="关闭导航菜单"
                class="text-default-500 hover:text-foreground cursor-pointer p-1"
                @click="mobileNavOpen = false"
              >
                <KunIcon name="lucide:x" />
              </button>
            </div>
            <DocsNav />
          </aside>
        </div>
      </Transition>
    </Teleport>

    <!-- Overlay providers (the docs use toasts in demos). -->
    <KunMessageProvider />
    <KunAlertProvider />
    <KunLoliProvider />
  </div>
</template>

<style scoped>
/* Mobile nav: fade the overlay, slide the panel in from the left. */
.mnav-enter-active,
.mnav-leave-active {
  transition: opacity 0.2s ease;
}
.mnav-enter-active .mnav-panel,
.mnav-leave-active .mnav-panel {
  transition: transform 0.2s ease;
}
.mnav-enter-from,
.mnav-leave-to {
  opacity: 0;
}
.mnav-enter-from .mnav-panel,
.mnav-leave-to .mnav-panel {
  transform: translateX(-100%);
}
</style>
