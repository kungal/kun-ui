<script setup lang="ts">
import Basic from '~/examples/reaction/Basic.vue'
import BasicSrc from '~/examples/reaction/Basic.vue?raw'
import Variants from '~/examples/reaction/Variants.vue'
import VariantsSrc from '~/examples/reaction/Variants.vue?raw'
import Sizes from '~/examples/reaction/Sizes.vue'
import SizesSrc from '~/examples/reaction/Sizes.vue?raw'
import ToggleOnly from '~/examples/reaction/ToggleOnly.vue'
import ToggleOnlySrc from '~/examples/reaction/ToggleOnly.vue?raw'
import Custom from '~/examples/reaction/Custom.vue'
import CustomSrc from '~/examples/reaction/Custom.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      紧凑胶囊,而非带文字内距的实心按钮——点击切换、图标填充变色 + 弹跳 + 爆裂,计数随之滚动。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不同表态</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纯切换(无计数)</h2>
    <Demo title="ToggleOnly.vue" :source="ToggleOnlySrc"><ToggleOnly /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义(插槽 + 任意颜色)</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>#icon</code> 插槽接管字形(emoji / 图片 / SVG,可按 <code>active</code> 切换);
      <code>color</code> 也接受任意 CSS 颜色(品牌色)——填充、弹跳、爆裂全跟着它走。
    </p>
    <Demo title="Custom.vue" :source="CustomSrc"><Custom /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunReaction.props" />
  </article>
</template>
