import tailwindcss from '@tailwindcss/vite'

// Minimal consumer of the @kun/ui-nuxt layer. Everything KunUI-related
// (component auto-imports, NuxtLink/@nuxt/icon injection, @nuxt/icon +
// @nuxt/image modules) comes from `extends`. The app only owns its
// Tailwind entry — see app/assets/css/main.css.
export default defineNuxtConfig({
  extends: ['@kun/ui-nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Keep the prerender verification self-contained: render only "/" and
  // don't crawl the demo links (e.g. /about has no page).
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },

  compatibilityDate: '2025-01-01',
})
