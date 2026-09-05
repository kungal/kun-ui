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
import ActionRow from '~/examples/reaction/ActionRow.vue'
import ActionRowSrc from '~/examples/reaction/ActionRow.vue?raw'
import Labeled from '~/examples/reaction/Labeled.vue'
import LabeledSrc from '~/examples/reaction/Labeled.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">带文字 label</h2>
    <p class="text-default-500 mb-2 text-sm">
      默认插槽 = 可见文字,渲染在按钮**内部**——所以点图标、文字或计数任意处都触发(收藏游戏 /
      收藏资源 这类场景);文字随激活态变色。不传则保持紧凑的「图标 + 计数」。
    </p>
    <Demo title="Labeled.vue" :source="LabeledSrc"><Labeled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">不同表态</h2>
    <Demo title="Variants.vue" :source="VariantsSrc"><Variants /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">尺寸</h2>
    <Demo title="Sizes.vue" :source="SizesSrc"><Sizes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纯切换(无计数)</h2>
    <Demo title="ToggleOnly.vue" :source="ToggleOnlySrc"><ToggleOnly /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">操作栏(toggle / action)</h2>
    <p class="text-default-500 mb-2 text-sm">
      点赞是切换(默认);评论 / 转发 / 更多用 <code>:toggle="false"</code> 做成「动作」——
      无按下态、无爆裂,只有轻点反馈,用原生 <code>@click</code> 处理。整条栏风格统一,
      不必混入更重的图标按钮。
    </p>
    <Demo title="ActionRow.vue" :source="ActionRowSrc"><ActionRow /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义(插槽 + 任意颜色)</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>#icon</code> 插槽接管字形(emoji / 图片 / SVG,可按 <code>active</code> 切换);
      <code>color</code> 也接受任意 CSS 颜色(品牌色)——填充、弹跳、爆裂全跟着它走。
    </p>
    <Demo title="Custom.vue" :source="CustomSrc"><Custom /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunReaction.props" />

    <EventsTable :rows="meta.KunReaction.events" />
    <SlotsTable :rows="meta.KunReaction.slots" />
  </article>
</template>
