<script setup lang="ts">
import Basic from '~/examples/checkboxgroup/Basic.vue'
import BasicSrc from '~/examples/checkboxgroup/Basic.vue?raw'
import Variants from '~/examples/checkboxgroup/Variants.vue'
import VariantsSrc from '~/examples/checkboxgroup/Variants.vue?raw'
import Card from '~/examples/checkboxgroup/Card.vue'
import CardSrc from '~/examples/checkboxgroup/Card.vue?raw'
import Max from '~/examples/checkboxgroup/Max.vue'
import MaxSrc from '~/examples/checkboxgroup/Max.vue?raw'
import Disabled from '~/examples/checkboxgroup/Disabled.vue'
import DisabledSrc from '~/examples/checkboxgroup/Disabled.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-600 mb-2 text-sm">
      <code class="text-primary">v-model</code> 是一个真正的数组 —— 这也是它和一排
      <code class="text-primary">KunCheckBox</code> 的区别：一个多选表单字段，而不是几个各自为政的布尔值。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">三种外观</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">卡片 + 图标</h2>
    <Demo title="Card.vue" :source="CardSrc"><Card /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">数量上限</h2>
    <p class="text-default-600 mb-2 text-sm">
      到达 <code class="text-primary">max</code> 后未选中的项不再可选，已选中的仍可取消；被拦下的点击会发出
      <code class="text-primary">invalid</code> 事件。
    </p>
    <Demo title="Max.vue" :source="MaxSrc"><Max /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCheckBoxGroup.props" />

    <EventsTable :rows="meta.KunCheckBoxGroup.events" />
    <SlotsTable :rows="meta.KunCheckBoxGroup.slots" />
  </article>
</template>
