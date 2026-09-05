<script setup lang="ts">
import Colors from '~/examples/chip/Colors.vue'
import ColorsSrc from '~/examples/chip/Colors.vue?raw'
import Variants from '~/examples/chip/Variants.vue'
import VariantsSrc from '~/examples/chip/Variants.vue?raw'
import Sizes from '~/examples/chip/Sizes.vue'
import SizesSrc from '~/examples/chip/Sizes.vue?raw'
import Closable from '~/examples/chip/Closable.vue'
import ClosableSrc from '~/examples/chip/Closable.vue?raw'
import Slots from '~/examples/chip/Slots.vue'
import SlotsSrc from '~/examples/chip/Slots.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可关闭</h2>
    <Demo title="Closable.vue" :source="ClosableSrc"><Closable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">起止插槽</h2>
    <Demo title="Slots.vue" :source="SlotsSrc"><Slots /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChip.props" />

    <EventsTable :rows="meta.KunChip.events" />
    <SlotsTable :rows="meta.KunChip.slots" />
  </article>
</template>
