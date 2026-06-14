<script setup lang="ts">
import Basic from '~/examples/avatargroup/Basic.vue'
import BasicSrc from '~/examples/avatargroup/Basic.vue?raw'
import Overflow from '~/examples/avatargroup/Overflow.vue'
import OverflowSrc from '~/examples/avatargroup/Overflow.vue?raw'
import ShowAll from '~/examples/avatargroup/ShowAll.vue'
import ShowAllSrc from '~/examples/avatargroup/ShowAll.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">超出折叠</h2>
    <Demo title="Overflow.vue" :source="OverflowSrc"><Overflow /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">展开全部</h2>
    <Demo title="ShowAll.vue" :source="ShowAllSrc"><ShowAll /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunAvatarGroup.props" />
  </article>
</template>
