<script setup lang="ts">
import Basic from '~/examples/button/Basic.vue'
import BasicSrc from '~/examples/button/Basic.vue?raw'
import Colors from '~/examples/button/Colors.vue'
import ColorsSrc from '~/examples/button/Colors.vue?raw'
import Variants from '~/examples/button/Variants.vue'
import VariantsSrc from '~/examples/button/Variants.vue?raw'
import Sizes from '~/examples/button/Sizes.vue'
import SizesSrc from '~/examples/button/Sizes.vue?raw'
import States from '~/examples/button/States.vue'
import StatesSrc from '~/examples/button/States.vue?raw'
import AsLink from '~/examples/button/AsLink.vue'
import AsLinkSrc from '~/examples/button/AsLink.vue?raw'

// Hand-fed from KunButtonProps; follow-up: auto-generate from the TS interface.
const buttonProps = [
  { name: 'color', type: 'KunUIColor', default: "'primary'", description: 'Semantic color.' },
  { name: 'variant', type: 'KunUIVariant', default: "'solid'", description: 'solid · bordered · light · flat · faded · shadow · ghost.' },
  { name: 'size', type: 'KunUISize', default: "'md'", description: 'xs · sm · md · lg · xl.' },
  { name: 'rounded', type: 'KunUIRounded', default: "'lg'", description: 'Corner radius bucket.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show a spinner and block clicks.' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to container width.' },
  { name: 'isIconOnly', type: 'boolean', default: 'false', description: 'Square icon-only button.' },
  { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Slot/icon side.' },
  { name: 'href', type: 'string', default: "''", description: 'Render as a link (NuxtLink in Nuxt, <a> in plain Vue).' },
  { name: 'target', type: "'_blank' | '_self' | '_parent' | '_top'", default: "'_self'", description: 'Link target when href is set.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type.' },
]
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Button</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunButton&gt;</code> — color, variant and size
      options, a loading state, and link rendering via <code class="text-primary">href</code>.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Colors</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Variants</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Sizes</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">States &amp; events</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">As a link</h2>
    <Demo title="AsLink.vue" :source="AsLinkSrc"><AsLink /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="buttonProps" />
  </article>
</template>
