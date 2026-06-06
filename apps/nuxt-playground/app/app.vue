<script setup lang="ts">
import type { KunTabItem } from '@kungal/ui-vue'
// `ref` is a Nuxt auto-import; the Kun* components come from the layer.
const modalOpen = ref(false)
const tab = ref('a')
const tabItems: KunTabItem[] = [
  { value: 'a', textValue: 'Overview' },
  { value: 'b', textValue: 'Details' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6 p-8">
    <h1 class="text-2xl font-bold">
      Kun<span class="text-primary">UI</span> on Nuxt
    </h1>

    <section class="flex flex-wrap items-center gap-2">
      <KunButton color="primary">Primary</KunButton>
      <KunButton color="secondary" variant="flat">Flat secondary</KunButton>
      <KunButton color="danger" variant="bordered">Bordered danger</KunButton>
      <KunButton :loading="true">Loading</KunButton>
      <KunButton :disabled="true">Disabled</KunButton>
    </section>

    <section class="flex flex-wrap items-center gap-3">
      <KunButton href="/about" variant="light">
        Internal link → NuxtLink
      </KunButton>
      <KunButton href="https://example.com" target="_blank" variant="light">
        External link
      </KunButton>
      <!-- bundled icons: inline, no @nuxt/icon fetch -->
      <KunIcon name="lucide:circle-check" class="text-success text-2xl" />
      <KunIcon name="lucide:info" class="text-primary text-2xl" />
    </section>

    <KunCard href="/about" color="primary" class-name="max-w-sm">
      <span class="font-medium">Card as NuxtLink</span>
      <span class="text-default-500 text-sm">href → renders &lt;a&gt;</span>
    </KunCard>

    <section>
      <KunButton color="primary" @click="modalOpen = true">Open modal</KunButton>
      <KunModal v-model="modalOpen">
        <div class="flex max-w-sm flex-col gap-3">
          <h3 class="text-lg font-semibold">KunModal under Nuxt SSR</h3>
          <p class="text-default-600 text-sm">
            Teleport + focus-trap + body-scroll-lock, all resolving through
            the Nuxt build.
          </p>
          <KunButton color="primary" @click="modalOpen = false">Close</KunButton>
        </div>
      </KunModal>
    </section>

    <section class="flex flex-wrap gap-2">
      <!-- useKunMessage is auto-imported by the layer (addImports). -->
      <KunButton color="success" @click="useKunMessage('Toast from a Nuxt app', 'success')">
        Show toast
      </KunButton>
      <KunButton
        color="danger"
        variant="flat"
        @click="useKunMessage('Error toast', 'error', 4000, false, 'bottom-right')"
      >
        Error (bottom-right)
      </KunButton>
    </section>

    <section class="flex flex-wrap items-center gap-4">
      <!-- KunTab (navigate via injected navigateTo) + KunTooltip
           (@floating-ui) resolving through the Nuxt build -->
      <KunTab v-model="tab" :items="tabItems" variant="pills" />
      <KunTooltip text="Tooltip under Nuxt">
        <KunButton variant="bordered">Hover me</KunButton>
      </KunTooltip>
    </section>

    <section class="flex flex-wrap items-center gap-4">
      <!-- KunLink → NuxtLink; KunImage → @nuxt/image (KunNuxtImg wrapper) -->
      <KunLink to="/about" color="primary">Internal link</KunLink>
      <KunImage
        src="/test.png"
        provider="none"
        alt="via @nuxt/image"
        :width="64"
        :height="64"
        :skeleton="false"
      />
    </section>

    <!-- Mounted once; renders all toasts (Teleported to body). -->
    <KunMessageProvider />
  </div>
</template>
