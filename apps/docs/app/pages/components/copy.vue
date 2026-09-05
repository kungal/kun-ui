<script setup lang="ts">
import Basic from '~/examples/copy/Basic.vue'
import BasicSrc from '~/examples/copy/Basic.vue?raw'
import CopiedText from '~/examples/copy/CopiedText.vue'
import CopiedTextSrc from '~/examples/copy/CopiedText.vue?raw'
import Colors from '~/examples/copy/Colors.vue'
import ColorsSrc from '~/examples/copy/Colors.vue?raw'
import Variants from '~/examples/copy/Variants.vue'
import VariantsSrc from '~/examples/copy/Variants.vue?raw'
import Sizes from '~/examples/copy/Sizes.vue'
import SizesSrc from '~/examples/copy/Sizes.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义已复制文案</h2>
    <Demo title="CopiedText.vue" :source="CopiedTextSrc"><CopiedText /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">变体</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCopy.props" />

    <EventsTable :rows="meta.KunCopy.events" />
    <SlotsTable :rows="meta.KunCopy.slots" />
  </article>
</template>
