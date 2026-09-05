<script setup lang="ts">
import Basic from '~/examples/checkbox/Basic.vue'
import BasicSrc from '~/examples/checkbox/Basic.vue?raw'
import Colors from '~/examples/checkbox/Colors.vue'
import ColorsSrc from '~/examples/checkbox/Colors.vue?raw'
import Sizes from '~/examples/checkbox/Sizes.vue'
import SizesSrc from '~/examples/checkbox/Sizes.vue?raw'
import Indeterminate from '~/examples/checkbox/Indeterminate.vue'
import IndeterminateSrc from '~/examples/checkbox/Indeterminate.vue?raw'
import Single from '~/examples/checkbox/Single.vue'
import SingleSrc from '~/examples/checkbox/Single.vue?raw'
import Disabled from '~/examples/checkbox/Disabled.vue'
import DisabledSrc from '~/examples/checkbox/Disabled.vue?raw'
import Description from '~/examples/checkbox/Description.vue'
import DescriptionSrc from '~/examples/checkbox/Description.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">三态 / 不确定</h2>
    <Demo title="Indeterminate.vue" :source="IndeterminateSrc"><Indeterminate /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">单选外观</h2>
    <Demo title="Single.vue" :source="SingleSrc"><Single /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">描述与错误</h2>
    <Demo title="Description.vue" :source="DescriptionSrc"><Description /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCheckBox.props" />

    <EventsTable :rows="meta.KunCheckBox.events" />
    <SlotsTable :rows="meta.KunCheckBox.slots" />
  </article>
</template>
