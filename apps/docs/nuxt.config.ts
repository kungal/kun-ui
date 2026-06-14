import tailwindcss from '@tailwindcss/vite'

// The KunUI docs site, built WITH KunUI (dogfooding). Everything KunUI-related
// (component auto-imports, NuxtLink/@nuxt/icon/@nuxt/image injection) comes from
// the layer; the app owns its Tailwind entry (app/assets/css/main.css) and its
// own docs primitives (Demo/Code/PropsTable) — no @nuxt/content.
export default defineNuxtConfig({
  extends: ['@kungal/ui-nuxt'],

  css: ['~/assets/css/main.css'],

  // Dev server port (production listens on the same port via NITRO_PORT in the
  // Docker image). 6757 by request — never the default 3000.
  devServer: { port: 6757 },

  // Site favicons / PWA manifest (assets live in app's public/). Per-route SEO
  // (title/description/OG/canonical) is set by useKunSeoMeta() in app.vue.
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
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
  // Shiki-highlighted code) is prerendered into the output. /sitemap.xml is
  // listed explicitly (nothing links to it).
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
      // Avatar/UserChip navigation demos render real profile links via the
      // default userLinkTemplate (/user/{id}/info). Those routes live in the
      // host galgame app, not this docs site, so skip them when crawling —
      // otherwise the prerenderer 404s on them and fails the build.
      ignore: ['/user/'],
    },
  },

  compatibilityDate: '2025-01-01',
})
