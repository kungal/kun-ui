<script setup lang="ts">
// `ref` is a Nuxt auto-import; KunButton / KunCard / KunIcon / KunModal are
// auto-imported by the @kungal/ui-nuxt layer. Proves the hardest component
// (Teleport + focus-trap + @vueuse deps) resolves through the Nuxt build.
const modalOpen = ref(false)
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
      <KunIcon name="lucide:heart" class="text-danger text-2xl" />
      <KunIcon name="lucide:star" class="text-warning text-2xl" />
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
  </div>
</template>
