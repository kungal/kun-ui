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
import Grouped from '~/examples/dropdown/Grouped.vue'
import GroupedSrc from '~/examples/dropdown/Grouped.vue?raw'
import Submenu from '~/examples/dropdown/Submenu.vue'
import SubmenuSrc from '~/examples/dropdown/Submenu.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">分隔线与快捷键</h2>
    <p class="text-default-600 mb-3 text-sm">
      开头、结尾和连续的分隔线会被去掉,按权限过滤后的命令表不会留下多余的线。
    </p>
    <Demo title="Grouped.vue" :source="GroupedSrc"><Grouped /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">子菜单</h2>
    <Demo title="Submenu.vue" :source="SubmenuSrc"><Submenu /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunDropdown.props" />

    <EventsTable :rows="meta.KunDropdown.events" />
    <SlotsTable :rows="meta.KunDropdown.slots" />
  </article>
</template>
