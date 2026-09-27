<script setup lang="ts">
import Basic from '~/examples/steps/Basic.vue'
import BasicSrc from '~/examples/steps/Basic.vue?raw'
import Vertical from '~/examples/steps/Vertical.vue'
import VerticalSrc from '~/examples/steps/Vertical.vue?raw'
import Colors from '~/examples/steps/Colors.vue'
import ColorsSrc from '~/examples/steps/Colors.vue?raw'
import Clickable from '~/examples/steps/Clickable.vue'
import ClickableSrc from '~/examples/steps/Clickable.vue?raw'
import NonLinear from '~/examples/steps/NonLinear.vue'
import NonLinearSrc from '~/examples/steps/NonLinear.vue?raw'
import ErrorDemo from '~/examples/steps/Error.vue'
import ErrorSrc from '~/examples/steps/Error.vue?raw'
import meta from '~/generated/component-meta.json'

const stepsProps = meta.KunSteps.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">点击跳转</h2>
    <p class="text-default-600 mb-2 text-sm">
      用 <code>v-model:current</code> 绑定后，步骤变成按钮：默认 <code>linear</code>
      只允许点回已走过的步骤，前进仍交给你自己的「下一步」和它的校验；只写
      <code>:current</code> 时保持纯展示。
    </p>
    <Demo title="Clickable.vue" :source="ClickableSrc"><Clickable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">非线性</h2>
    <p class="text-default-600 mb-2 text-sm">
      <code>:linear="false"</code> 让每一步都能直接点到，适合没有先后依赖的引导流程；单个步骤可用
      <code>disabled</code> 排除。
    </p>
    <Demo title="NonLinear.vue" :source="NonLinearSrc"><NonLinear /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误状态</h2>
    <p class="text-default-600 mb-2 text-sm">
      条目的 <code>status: 'error'</code> 把该步标成失败，与它相对 <code>current</code> 的位置无关。
    </p>
    <Demo title="Error.vue" :source="ErrorSrc"><ErrorDemo /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">纵向</h2>
    <Demo title="Vertical.vue" :source="VerticalSrc"><Vertical /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色与尺寸</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="stepsProps" />

    <EventsTable :rows="meta.KunSteps.events" />
    <SlotsTable :rows="meta.KunSteps.slots" />
  </article>
</template>
