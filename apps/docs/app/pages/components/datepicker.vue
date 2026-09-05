<script setup lang="ts">
import Basic from '~/examples/datepicker/Basic.vue'
import BasicSrc from '~/examples/datepicker/Basic.vue?raw'
import Range from '~/examples/datepicker/Range.vue'
import RangeSrc from '~/examples/datepicker/Range.vue?raw'
import Precision from '~/examples/datepicker/Precision.vue'
import PrecisionSrc from '~/examples/datepicker/Precision.vue?raw'
import Format from '~/examples/datepicker/Format.vue'
import FormatSrc from '~/examples/datepicker/Format.vue?raw'
import Colors from '~/examples/datepicker/Colors.vue'
import ColorsSrc from '~/examples/datepicker/Colors.vue?raw'
import States from '~/examples/datepicker/States.vue'
import StatesSrc from '~/examples/datepicker/States.vue?raw'
import Error from '~/examples/datepicker/Error.vue'
import ErrorSrc from '~/examples/datepicker/Error.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">日期范围</h2>
    <Demo title="Range.vue" :source="RangeSrc"><Range /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">选择粒度（日 / 月 / 年）</h2>
    <Demo title="Precision.vue" :source="PrecisionSrc"><Precision /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">格式与禁用日期</h2>
    <Demo title="Format.vue" :source="FormatSrc"><Format /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">清除与禁用</h2>
    <Demo title="States.vue" :source="StatesSrc"><States /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误</h2>
    <Demo title="Error.vue" :source="ErrorSrc"><Error /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunDatePicker.props" />

    <EventsTable :rows="meta.KunDatePicker.events" />
    <SlotsTable :rows="meta.KunDatePicker.slots" />
  </article>
</template>
