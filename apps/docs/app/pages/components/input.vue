<script setup lang="ts">
import Basic from '~/examples/input/Basic.vue'
import BasicSrc from '~/examples/input/Basic.vue?raw'
import Sizes from '~/examples/input/Sizes.vue'
import SizesSrc from '~/examples/input/Sizes.vue?raw'
import States from '~/examples/input/States.vue'
import StatesSrc from '~/examples/input/States.vue?raw'
import Clearable from '~/examples/input/Clearable.vue'
import ClearableSrc from '~/examples/input/Clearable.vue?raw'
import Affix from '~/examples/input/Affix.vue'
import AffixSrc from '~/examples/input/Affix.vue?raw'
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

    <h2 class="mt-8 mb-1 text-xl font-semibold">状态</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可清除与密码</h2>
    <Demo title="Clearable.vue" :source="ClearableSrc"><Clearable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">前后缀</h2>
    <Demo title="Affix.vue" :source="AffixSrc"><Affix /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunInput.props" />

    <EventsTable :rows="meta.KunInput.events" />
    <SlotsTable :rows="meta.KunInput.slots" />
  </article>
</template>
