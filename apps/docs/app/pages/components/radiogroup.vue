<script setup lang="ts">
import Basic from '~/examples/radiogroup/Basic.vue'
import BasicSrc from '~/examples/radiogroup/Basic.vue?raw'
import Card from '~/examples/radiogroup/Card.vue'
import CardSrc from '~/examples/radiogroup/Card.vue?raw'
import Colors from '~/examples/radiogroup/Colors.vue'
import ColorsSrc from '~/examples/radiogroup/Colors.vue?raw'
import Descriptions from '~/examples/radiogroup/Descriptions.vue'
import DescriptionsSrc from '~/examples/radiogroup/Descriptions.vue?raw'
import Orientation from '~/examples/radiogroup/Orientation.vue'
import OrientationSrc from '~/examples/radiogroup/Orientation.vue?raw'
import Disabled from '~/examples/radiogroup/Disabled.vue'
import DisabledSrc from '~/examples/radiogroup/Disabled.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">卡片变体</h2>
    <Demo title="Card.vue" :source="CardSrc"><Card /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带描述的选项</h2>
    <Demo title="Descriptions.vue" :source="DescriptionsSrc"><Descriptions /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">方向</h2>
    <Demo title="Orientation.vue" :source="OrientationSrc"><Orientation /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunRadioGroup.props" />
  </article>
</template>
