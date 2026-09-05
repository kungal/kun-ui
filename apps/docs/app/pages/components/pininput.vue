<script setup lang="ts">
import Basic from '~/examples/pininput/Basic.vue'
import BasicSrc from '~/examples/pininput/Basic.vue?raw'
import Masked from '~/examples/pininput/Masked.vue'
import MaskedSrc from '~/examples/pininput/Masked.vue?raw'
import LengthType from '~/examples/pininput/LengthType.vue'
import LengthTypeSrc from '~/examples/pininput/LengthType.vue?raw'
import Colors from '~/examples/pininput/Colors.vue'
import ColorsSrc from '~/examples/pininput/Colors.vue?raw'
import Sizes from '~/examples/pininput/Sizes.vue'
import SizesSrc from '~/examples/pininput/Sizes.vue?raw'
import States from '~/examples/pininput/States.vue'
import StatesSrc from '~/examples/pininput/States.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">掩码</h2>
    <Demo title="Masked.vue" :source="MaskedSrc"><Masked /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">长度与类型</h2>
    <Demo title="LengthType.vue" :source="LengthTypeSrc"><LengthType /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">状态</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunPinInput.props" />

    <EventsTable :rows="meta.KunPinInput.events" />
    <SlotsTable :rows="meta.KunPinInput.slots" />
  </article>
</template>
