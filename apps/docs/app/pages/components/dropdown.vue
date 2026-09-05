<script setup lang="ts">
import Basic from '~/examples/dropdown/Basic.vue'
import BasicSrc from '~/examples/dropdown/Basic.vue?raw'
import WithIcons from '~/examples/dropdown/WithIcons.vue'
import WithIconsSrc from '~/examples/dropdown/WithIcons.vue?raw'
import Colors from '~/examples/dropdown/Colors.vue'
import ColorsSrc from '~/examples/dropdown/Colors.vue?raw'
import Disabled from '~/examples/dropdown/Disabled.vue'
import DisabledSrc from '~/examples/dropdown/Disabled.vue?raw'
import AsLink from '~/examples/dropdown/AsLink.vue'
import AsLinkSrc from '~/examples/dropdown/AsLink.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带图标</h2>
    <Demo title="WithIcons.vue" :source="WithIconsSrc"><WithIcons /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色项</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用项</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">链接项</h2>
    <Demo title="AsLink.vue" :source="AsLinkSrc"><AsLink /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunDropdown.props" />

    <EventsTable :rows="meta.KunDropdown.events" />
    <SlotsTable :rows="meta.KunDropdown.slots" />
  </article>
</template>
