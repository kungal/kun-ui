<script setup lang="ts">
import Basic from '~/examples/icon/Basic.vue'
import BasicSrc from '~/examples/icon/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Icon</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunIcon&gt;</code> — renders an inline SVG from
      the bundled registry; it <strong>never</strong> fetches from the Iconify API.
      It inherits text color, so <code class="text-primary">text-*</code> tints it.
    </p>

    <KunInfo
      class="mt-6"
      color="info"
      icon="lucide:info"
      title="Bundled only"
      description="Use bundled names like lucide:check. Register your own with registerKunIcon(s) from @kungal/core; unknown names fall back to the injected iconComponent (@nuxt/icon under the Nuxt layer)."
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunIcon.props" />
  </article>
</template>
