<script setup lang="ts">
import Basic from '~/examples/commandpalette/Basic.vue'
import BasicSrc from '~/examples/commandpalette/Basic.vue?raw'
import Async from '~/examples/commandpalette/Async.vue'
import AsyncSrc from '~/examples/commandpalette/Async.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <p class="text-default-600 mt-4 text-sm">
      通用的 ⌘K 命令面板<strong>外壳</strong>:触发器 + 快捷键、弹层、自动聚焦、body 滚动锁、键盘导航(↑↓/Home/End/Enter/Esc)、分组、安全高亮与无障碍。
      它<strong>不含搜索逻辑</strong> —— 你用 <code>v-model:query</code> 拿到查询,自己算出 <code>items</code>(扁平或分组),库负责渲染与导航;选中触发 <code>@select</code>。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-default-500 mb-2 text-sm">
      静态命令,按 <code>query</code> 过滤并分组。默认 <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> 打开(本页顶部的搜索就是活例;这里的示例关掉了快捷键以免和它冲突,改用按钮触发)。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">远程搜索(loading)</h2>
    <p class="text-default-500 mb-2 text-sm">
      监听 <code>query</code> 发请求,请求中传 <code>:loading</code> —— 面板显示加载态而非「无结果」。
    </p>
    <Demo title="Async.vue" :source="AsyncSrc"><Async /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCommandPalette.props" />
  </article>
</template>
