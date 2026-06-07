<script setup lang="ts">
import type { KunUIVariant, KunUIColor, KunUISize } from '@kungal/ui-core'

const variants: KunUIVariant[] = [
  'solid',
  'bordered',
  'light',
  'flat',
  'faded',
  'shadow',
  'ghost',
]
const colors: KunUIColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Button — variant × color</h2>

    <div class="flex flex-col gap-3">
      <div v-for="variant in variants" :key="variant" class="flex flex-col gap-1">
        <span class="text-default-500 text-xs uppercase">{{ variant }}</span>
        <div class="flex flex-wrap items-center gap-2">
          <KunButton
            v-for="color in colors"
            :key="color"
            :variant="variant"
            :color="color"
          >
            {{ color }}
          </KunButton>
        </div>
      </div>
    </div>

    <h3 class="mt-2 text-base font-medium">Sizes</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton v-for="size in sizes" :key="size" :size="size">
        {{ size }}
      </KunButton>
    </div>

    <h3 class="mt-2 text-base font-medium">States</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton :loading="true">Loading</KunButton>
      <KunButton :disabled="true">Disabled</KunButton>
      <KunButton color="success" variant="flat">Ripple me</KunButton>
      <KunButton href="https://example.com" target="_blank" variant="light">
        Link (renders &lt;a&gt;)
      </KunButton>
      <KunButton color="danger" :is-icon-only="true" aria-label="delete">
        <template #icon><span>✕</span></template>
      </KunButton>
    </div>

    <h3 class="mt-2 text-base font-medium">Rounded</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton rounded="none">none</KunButton>
      <KunButton rounded="sm">sm</KunButton>
      <KunButton rounded="md">md</KunButton>
      <KunButton rounded="lg">lg</KunButton>
      <KunButton rounded="full">full</KunButton>
    </div>

    <div class="max-w-md">
      <KunButton :full-width="true" color="secondary">Full width</KunButton>
    </div>
  </section>
</template>
