<script setup lang="ts">
const installCmd =
  'pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/core @kungal/tokens tailwindcss @tailwindcss/vite'

const cssEntry = `@import 'tailwindcss';
@import '@kungal/tokens';
@import '@kungal/ui-vue/style.css';

/* generate the utilities the components use */
@source '../../node_modules/@kungal/ui-vue';
@source '../../node_modules/@kungal/core';`
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">
      Kun<span class="text-primary">UI</span>
    </h1>
    <p class="text-default-600 mt-3 text-lg">
      Cross-framework component library — 53 Tailwind v4 Vue components, a
      framework-agnostic core + tokens, and a Nuxt layer.
      <span class="text-foreground font-medium">This very site is built with KunUI.</span>
    </p>

    <h2 class="mt-10 mb-3 text-xl font-semibold">Critical rules</h2>
    <div class="flex flex-col gap-3">
      <KunInfo
        color="warning"
        icon="lucide:triangle-alert"
        title="HTML is never sanitized"
        description="Sanitize untrusted HTML yourself before passing it to KunContent or richText toasts. KunUI ships no sanitizer (SSR-safe by design)."
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="Icons are bundled, never fetched"
        description="KunIcon renders inline SVG from a registry — no runtime Iconify calls. Register your own with registerKunIcon(s)."
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="You own the Tailwind entry"
        description="Your app's CSS imports tailwindcss + @kungal/tokens + @kungal/ui-vue/style.css and @sources the packages."
      />
    </div>

    <h2 class="mt-10 mb-3 text-xl font-semibold">Install (Nuxt)</h2>
    <Code lang="bash" :code="installCmd" />
    <p class="text-default-600 mt-3">
      Add <code class="text-primary">extends: ['@kungal/ui-nuxt']</code> to
      <code class="text-primary">nuxt.config</code>, then your CSS entry:
    </p>
    <Code lang="css" :code="cssEntry" />

    <div class="mt-8">
      <KunButton color="primary" href="/components/button">Browse components →</KunButton>
    </div>
  </article>
</template>
