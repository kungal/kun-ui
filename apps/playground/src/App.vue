<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import ButtonShowcase from './sections/ButtonShowcase.vue'
import CardShowcase from './sections/CardShowcase.vue'
import IconShowcase from './sections/IconShowcase.vue'
import ModalShowcase from './sections/ModalShowcase.vue'
import MessageShowcase from './sections/MessageShowcase.vue'
import TabShowcase from './sections/TabShowcase.vue'
import FloatingShowcase from './sections/FloatingShowcase.vue'
import MediaShowcase from './sections/MediaShowcase.vue'
import DisplayShowcase from './sections/DisplayShowcase.vue'
import FormShowcase from './sections/FormShowcase.vue'
import OverlayShowcase from './sections/OverlayShowcase.vue'
import MiscShowcase from './sections/MiscShowcase.vue'
import ContentShowcase from './sections/ContentShowcase.vue'
import DateShowcase from './sections/DateShowcase.vue'
import FileShowcase from './sections/FileShowcase.vue'
import PeopleShowcase from './sections/PeopleShowcase.vue'
import AlertShowcase from './sections/AlertShowcase.vue'

// Dark mode is driven by the `.kun-dark-mode` class on <html>: @kungal/tokens
// both flips its CSS variables under that selector AND wires the Tailwind
// `dark:` variant to `&:is(.kun-dark-mode *)`.
const dark = ref(false)
watchEffect(() => {
  document.documentElement.classList.toggle('kun-dark-mode', dark.value)
})

const colors = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'default',
] as const

const swatch: Record<(typeof colors)[number], string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  default: 'bg-default',
}
</script>

<template>
  <div class="min-h-screen">
    <header
      class="z-kun-sticky bg-background/80 sticky top-0 flex items-center justify-between border-b px-6 py-4 backdrop-blur"
    >
      <div>
        <h1 class="text-xl font-bold">
          Kun<span class="text-primary">UI</span> Playground
        </h1>
        <p class="text-default-500 text-sm">
          @kungal/ui-vue · decoupled from Nuxt · powered by @kungal/tokens + @kungal/core
        </p>
      </div>
      <KunButton
        :variant="dark ? 'solid' : 'bordered'"
        color="secondary"
        @click="dark = !dark"
      >
        {{ dark ? '🌙 Dark' : '☀️ Light' }}
      </KunButton>
    </header>

    <main class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold">Palette (semantic tokens)</h2>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="c in colors"
            :key="c"
            class="flex flex-col items-center gap-1"
          >
            <div :class="[swatch[c], 'h-12 w-20 rounded-kun-md border']" />
            <span class="text-default-500 text-xs">{{ c }}</span>
          </div>
        </div>
      </section>

      <ButtonShowcase />
      <CardShowcase />
      <TabShowcase />
      <FloatingShowcase />
      <MediaShowcase />
      <DisplayShowcase />
      <FormShowcase />
      <OverlayShowcase />
      <MiscShowcase />
      <ContentShowcase />
      <DateShowcase />
      <FileShowcase />
      <PeopleShowcase />
      <AlertShowcase />
      <ModalShowcase />
      <MessageShowcase />
      <IconShowcase />
    </main>

    <!-- Mounted once each; render toasts / confirm dialogs / loli popups. -->
    <KunMessageProvider />
    <KunAlertProvider />
    <KunLoliProvider />
  </div>
</template>
