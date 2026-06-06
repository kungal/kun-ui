import tailwindcss from '@tailwindcss/vite'

// The KunUI docs site, built WITH KunUI (dogfooding). Everything KunUI-related
// (component auto-imports, NuxtLink/@nuxt/icon/@nuxt/image injection) comes from
// the layer; the app owns its Tailwind entry (app/assets/css/main.css) and its
// own docs primitives (Demo/Code/PropsTable) — no @nuxt/content.
export default defineNuxtConfig({
  extends: ['@kungal/ui-nuxt'],

  css: ['~/assets/css/main.css'],

  // Site favicons / PWA manifest (assets live in app's public/). The page
  // title is set per-route in app.vue.
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [{ name: 'theme-color', content: '#ffffff' }],
    },
  },

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
