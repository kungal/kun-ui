<script setup lang="ts">
import Colors from '~/examples/chip/Colors.vue'
import ColorsSrc from '~/examples/chip/Colors.vue?raw'
import Variants from '~/examples/chip/Variants.vue'
import VariantsSrc from '~/examples/chip/Variants.vue?raw'
import Sizes from '~/examples/chip/Sizes.vue'
import SizesSrc from '~/examples/chip/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Chip</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunChip&gt;</code> — a small tag / pill with
      color, variant and size.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Colors</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Variants</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Sizes</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunChip.props" />
  </article>
</template>
