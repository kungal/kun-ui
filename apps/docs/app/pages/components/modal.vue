<script setup lang="ts">
import Basic from '~/examples/modal/Basic.vue'
import BasicSrc from '~/examples/modal/Basic.vue?raw'
import Sizes from '~/examples/modal/Sizes.vue'
import SizesSrc from '~/examples/modal/Sizes.vue?raw'
import Placement from '~/examples/modal/Placement.vue'
import PlacementSrc from '~/examples/modal/Placement.vue?raw'
import ScrollBehavior from '~/examples/modal/ScrollBehavior.vue'
import ScrollBehaviorSrc from '~/examples/modal/ScrollBehavior.vue?raw'
import NonDismissable from '~/examples/modal/NonDismissable.vue'
import NonDismissableSrc from '~/examples/modal/NonDismissable.vue?raw'
import AlertDialog from '~/examples/modal/AlertDialog.vue'
import AlertDialogSrc from '~/examples/modal/AlertDialog.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">位置</h2>
    <Demo title="Placement.vue" :source="PlacementSrc"><Placement /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">滚动行为</h2>
    <Demo title="ScrollBehavior.vue" :source="ScrollBehaviorSrc">
      <ScrollBehavior />
    </Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不可关闭与隐藏关闭按钮</h2>
    <Demo title="NonDismissable.vue" :source="NonDismissableSrc">
      <NonDismissable />
    </Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">警告对话框</h2>
    <Demo title="AlertDialog.vue" :source="AlertDialogSrc"><AlertDialog /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunModal.props" />
  </article>
</template>
