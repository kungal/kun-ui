import tailwindcss from '@tailwindcss/vite'

// The KunUI docs site, built WITH KunUI (dogfooding). Everything KunUI-related
// (component auto-imports, NuxtLink/@nuxt/icon/@nuxt/image injection) comes from
// the layer; the app owns its Tailwind entry (app/assets/css/main.css) and its
// own docs primitives (Demo/Code/PropsTable) — no @nuxt/content.
export default defineNuxtConfig({
  extends: ['@kungal/ui-nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Fully static: crawl internal links from "/" so every page (and its
  // Shiki-highlighted code) is prerendered into the output.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  compatibilityDate: '2025-01-01',
})
