<script setup lang="ts">
import Basic from '~/examples/skeleton/Basic.vue'
import BasicSrc from '~/examples/skeleton/Basic.vue?raw'
import Shapes from '~/examples/skeleton/Shapes.vue'
import ShapesSrc from '~/examples/skeleton/Shapes.vue?raw'
import Loaded from '~/examples/skeleton/Loaded.vue'
import LoadedSrc from '~/examples/skeleton/Loaded.vue?raw'
import meta from '~/generated/component-meta.json'

const skeletonProps = meta.KunSkeleton.props
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      <code>text</code> 占一整行的行盒(<code>1lh</code>),中间画一条 <code>1em</code> 高的条,和一行真文字占的高度相同,内容到达时下方不会跳动。
      它沿用继承到的字号与行高,所以给它和真实内容相同的字号类(如 <code>class-name="text-sm"</code>);同一段落的多行之间不要再加间距。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">形状</h2>
    <Demo title="Shapes.vue" :source="ShapesSrc"><Shapes /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">加载完成切换</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      骨架带 <code>aria-hidden</code>,读屏器看不到它。播报交给加载区域的容器:设 <code>aria-live="polite"</code>,加载期间设 <code>aria-busy="true"</code>,读屏器会在加载完成后一次性读出新内容,而不是每个骨架各报一次。
    </p>
    <Demo title="Loaded.vue" :source="LoadedSrc"><Loaded /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="skeletonProps" />

    <EventsTable :rows="meta.KunSkeleton.events" />
    <SlotsTable :rows="meta.KunSkeleton.slots" />
  </article>
</template>
