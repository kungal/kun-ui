# @kun/nuxt-playground

A **minimal Nuxt app** whose only job is to verify the `@kun/ui-nuxt`
layer: that KunUI components auto-import, that `href` renders as `NuxtLink`,
and that `<KunIcon>` renders via `@nuxt/icon` — all under SSR.

Almost everything comes from `extends: ['@kun/ui-nuxt']`. The app itself
only owns its Tailwind entry (`app/assets/css/main.css`) and the
`@tailwindcss/vite` plugin.

```bash
pnpm --filter @kun/nuxt-playground dev        # interactive
pnpm --filter @kun/nuxt-playground generate   # prerender → inspect SSR HTML
```

After `generate`, `.output/public/index.html` should contain a real
`<button>` with `bg-primary` classes, an `<a href="/about">` (proof the
NuxtLink injection works), and an inline icon SVG from `@nuxt/icon`.
