<script setup lang="ts">
import ComplexCard from '~/examples/shatter/ComplexCard.vue'
import ComplexCardSrc from '~/examples/shatter/ComplexCard.vue?raw'
import Basic from '~/examples/shatter/Basic.vue'
import BasicSrc from '~/examples/shatter/Basic.vue?raw'
import ImageShatter from '~/examples/shatter/ImageShatter.vue'
import ImageShatterSrc from '~/examples/shatter/ImageShatter.vue?raw'
import Model from '~/examples/shatter/Model.vue'
import ModelSrc from '~/examples/shatter/Model.vue?raw'
import Origin from '~/examples/shatter/Origin.vue'
import OriginSrc from '~/examples/shatter/Origin.vue?raw'
import Pieces from '~/examples/shatter/Pieces.vue'
import PiecesSrc from '~/examples/shatter/Pieces.vue?raw'
import Physics from '~/examples/shatter/Physics.vue'
import PhysicsSrc from '~/examples/shatter/Physics.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <KunInfo
      class="mt-4"
      color="primary"
      title="为什么它能稳定 60fps"
      description="碎片几何由内置的 Voronoi 剖分生成(零运行时依赖)。每个碎片只被裁剪到自身包围盒大小并隔离绘制,所以一次性构建成本 ≈ 元素自身面积,而非 N 倍全尺寸图层;飞散阶段只动 transform 与 opacity——这两个属性在合成器线程上运行,不触发布局与重绘。运动是把真实的弹道轨迹(向外冲量 + 空气阻力 + 重力 t² 加速)采样进多段线性关键帧,因此自然连贯;clip-path 仅用于刻画玻璃边、保持静止。"
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">打碎一个真实组件</h2>
    <p class="text-default-500 mb-2 text-sm">
      它能包裹任意内容——这里是一张完整的卡片(封面图、评分、标签、简介、按钮)。点
      <code>打碎这张卡片</code>,整张卡连同里面的图文一起碎成玻璃片飞散坠落;点「重新组合」,
      同样的碎片会沿原路飞回、归位重新拼成卡片。触发用的是组件 ref 暴露的
      <code>shatter()</code> / <code>restore()</code>。
    </p>
    <Demo title="ComplexCard.vue" :source="ComplexCardSrc"><ComplexCard /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>trigger="click"</code> 即可点击打碎;碎裂从点击点向外炸开,
      <code>:auto-restore</code> 让它在若干毫秒后自动复原。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">打碎图片</h2>
    <p class="text-default-500 mb-2 text-sm">
      最常见的 ACGN 场景:点击打碎一张图片。每个碎片携带它对应的那一块图像切片飞散——
      直接克隆真实 DOM,无需 canvas 截图,也没有跨域 taint 问题。
    </p>
    <Demo title="ImageShatter.vue" :source="ImageShatterSrc"><ImageShatter /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">v-model 触发</h2>
    <p class="text-default-500 mb-2 text-sm">
      默认 <code>trigger="manual"</code>——用 <code>v-model:shattered</code> 声明式控制
      (像「带玻璃碎裂的 v-if」)。复原时默认带「重新拼合」动画(<code>reassemble</code>),
      设 <code>:reassemble="false"</code> 则瞬时复原。<code>keep-space</code>
      在碎裂后保留原位占位,避免布局跳动。
    </p>
    <Demo title="Model.vue" :source="ModelSrc"><Model /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">碎裂原点</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>origin</code> 决定碎片向外飞散的中心:<code>center</code>(默认)、
      <code>top</code>、<code>pointer</code>(上次指针位置),或显式
      <code>{ x, y }</code> 像素坐标。
    </p>
    <Demo title="Origin.vue" :source="OriginSrc"><Origin /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">碎片数量</h2>
    <p class="text-default-500 mb-2 text-sm">
      <code>pieces</code> 控制碎片数(2–160)。数量越多构建越重,但飞散动画始终只在
      合成器线程,帧率不受影响。
    </p>
    <Demo title="Pieces.vue" :source="PiecesSrc"><Pieces /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">物理手感</h2>
    <p class="text-default-500 mb-2 text-sm">
      用 <code>gravity</code>(重力,t² 加速下坠)、<code>spread</code>(飞散距离)、
      <code>rotation</code>(最大自旋)组合出不同效果——轻盈飘散、加速坠落、猛烈炸裂。
    </p>
    <Demo title="Physics.vue" :source="PhysicsSrc"><Physics /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunShatter.props" />
  </article>
</template>
