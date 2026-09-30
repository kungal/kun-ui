<script setup lang="ts">
import Basic from '~/examples/contextmenu/Basic.vue'
import BasicSrc from '~/examples/contextmenu/Basic.vue?raw'
import WithIcons from '~/examples/contextmenu/WithIcons.vue'
import WithIconsSrc from '~/examples/contextmenu/WithIcons.vue?raw'
import Disabled from '~/examples/contextmenu/Disabled.vue'
import DisabledSrc from '~/examples/contextmenu/Disabled.vue?raw'
import Colors from '~/examples/contextmenu/Colors.vue'
import ColorsSrc from '~/examples/contextmenu/Colors.vue?raw'
import Commands from '~/examples/contextmenu/Commands.vue'
import CommandsSrc from '~/examples/contextmenu/Commands.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用项</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色项</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">分隔线、快捷键与子菜单</h2>
    <p class="text-default-600 mb-3 text-sm">
      <code>{ type: 'separator' }</code> 是分隔线;<code>shortcut</code> 在 Apple 上显示 ⌘,其它平台显示 Ctrl,只负责显示,按键由应用绑定;带
      <code>children</code> 的项打开一层子菜单(悬停、→ 或点按),← 与 Esc 只关闭子菜单这一层。
    </p>
    <Demo title="Commands.vue" :source="CommandsSrc"><Commands /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunContextMenu.props" />

    <EventsTable :rows="meta.KunContextMenu.events" />
    <SlotsTable :rows="meta.KunContextMenu.slots" />
  </article>
</template>
