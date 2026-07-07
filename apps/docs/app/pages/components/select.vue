<script setup lang="ts">
import Basic from '~/examples/select/Basic.vue'
import BasicSrc from '~/examples/select/Basic.vue?raw'
import Searchable from '~/examples/select/Searchable.vue'
import SearchableSrc from '~/examples/select/Searchable.vue?raw'
import Multiple from '~/examples/select/Multiple.vue'
import MultipleSrc from '~/examples/select/Multiple.vue?raw'
import Clearable from '~/examples/select/Clearable.vue'
import ClearableSrc from '~/examples/select/Clearable.vue?raw'
import Disabled from '~/examples/select/Disabled.vue'
import DisabledSrc from '~/examples/select/Disabled.vue?raw'
import Error from '~/examples/select/Error.vue'
import ErrorSrc from '~/examples/select/Error.vue?raw'
import Colors from '~/examples/select/Colors.vue'
import ColorsSrc from '~/examples/select/Colors.vue?raw'
import CustomOption from '~/examples/select/CustomOption.vue'
import CustomOptionSrc from '~/examples/select/CustomOption.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可搜索</h2>
    <Demo title="Searchable.vue" :source="SearchableSrc"><Searchable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">多选</h2>
    <Demo title="Multiple.vue" :source="MultipleSrc"><Multiple /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">可清除</h2>
    <Demo title="Clearable.vue" :source="ClearableSrc"><Clearable /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">禁用</h2>
    <Demo title="Disabled.vue" :source="DisabledSrc"><Disabled /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">错误</h2>
    <Demo title="Error.vue" :source="ErrorSrc"><Error /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">颜色</h2>
    <Demo title="Colors.vue" :source="ColorsSrc"><Colors /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">自定义选项（#option 插槽）</h2>
    <Demo title="CustomOption.vue" :source="CustomOptionSrc"><CustomOption /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunSelect.props" />
  </article>
</template>
