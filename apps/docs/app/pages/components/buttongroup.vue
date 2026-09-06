<script setup lang="ts">
import Basic from '~/examples/buttongroup/Basic.vue'
import BasicSrc from '~/examples/buttongroup/Basic.vue?raw'
import Sizes from '~/examples/buttongroup/Sizes.vue'
import SizesSrc from '~/examples/buttongroup/Sizes.vue?raw'
import Vertical from '~/examples/buttongroup/Vertical.vue'
import VerticalSrc from '~/examples/buttongroup/Vertical.vue?raw'
import Split from '~/examples/buttongroup/Split.vue'
import SplitSrc from '~/examples/buttongroup/Split.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">分裂按钮</h2>
    <p class="text-default-600 mb-2 text-sm">
      主操作 + 一个箭头按钮触发 <code class="text-primary">KunDropdown</code>。菜单面板 Teleport 到
      <code class="text-primary">body</code>，不是组的后代，所以只有触发按钮会被切角，菜单里的按钮不受影响。
    </p>
    <Demo title="Split.vue" :source="SplitSrc"><Split /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunButtonGroup.props" />

    <EventsTable :rows="meta.KunButtonGroup.events" />
    <SlotsTable :rows="meta.KunButtonGroup.slots" />
  </article>
</template>
