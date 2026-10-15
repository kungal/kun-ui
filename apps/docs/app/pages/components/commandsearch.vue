<script setup lang="ts">
import Basic from '~/examples/commandsearch/Basic.vue'
import BasicSrc from '~/examples/commandsearch/Basic.vue?raw'
import Responsive from '~/examples/commandsearch/Responsive.vue'
import ResponsiveSrc from '~/examples/commandsearch/Responsive.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <p class="text-default-600 mt-4 text-sm">
      常驻在顶栏里的搜索框:聚焦时在框下方展开结果面板,输入时显示分组结果,回车前往完整的搜索页 ——
      Slack、Teams、GitHub、Jira、Steam 的顶栏搜索都是这种形态。它和
      <NuxtLink to="/components/commandpalette" class="text-primary">KunCommandPalette</NuxtLink>
      共用同一套条目(<code>KunCommandItem</code> / 分组)、渲染与高亮,区别只在外壳:没有对话框、遮罩、滚动锁和焦点陷阱,焦点始终留在输入框里。
      和面板一样,它<strong>不含搜索逻辑</strong>:用 <code>v-model:query</code> 拿到查询,自己算出 <code>items</code>。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      空输入框聚焦时显示你给的条目(这里是「最近搜索」);既没有条目、也没有 <code>#empty</code> 插槽时不弹出空面板。
      输入后显示「搜索「…」」动作行和分组结果。和命令面板不同,<strong>默认不高亮任何一行</strong>:
      回车触发 <code>@submit</code>,带上去掉首尾空格的查询;用 ↑↓ 移到某一行后回车才是 <code>@select</code>。
      ↑ 从第一行再往上,回到「没有高亮」的状态。
    </p>
    <p class="text-foreground-muted mb-2 text-sm">
      第一次按 <kbd>Esc</kbd> 收起面板并保留文字,再按一次清空文字。<kbd>Tab</kbd>、点击外部、选中或提交都会收起面板。
      带 <code>removable</code> 的条目(最近搜索)行尾有移除按钮,键盘上按 <kbd>Shift</kbd>+<kbd>Delete</kbd>
      移除当前高亮行;两者都触发 <code>@remove</code>,由你把它从 <code>items</code> 里删掉。
      「清空搜索记录」就是一条普通条目。
    </p>
    <p class="text-foreground-muted mb-2 text-sm">
      防抖和请求都由你来做;请求开始时就把 <code>loading</code> 设为 <code>true</code>,输入框左侧的放大镜会变成加载圈。
      已经显示的结果在新结果到达前保留,列表不会每敲一个字就闪一次。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">窄屏:换成命令面板</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      手机顶栏放不下常驻搜索框。组件本身不按屏宽切换(用 JS 判断屏宽会让 SSR 渲染出错的布局),
      而是由你用断点类组合:<code>md</code> 以上显示 KunCommandSearch,以下显示 KunCommandPalette 的图标按钮,两者共用同一份
      <code>query</code> 和 <code>items</code>。
    </p>
    <p class="text-foreground-muted mb-2 text-sm">
      快捷键默认是 <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd>,作用是聚焦搜索框。搜索框不在屏幕上(被断点隐藏)或在打开的模态框后面时,
      它不响应,同一页上的 KunCommandPalette 照常接手打开面板;搜索框在屏幕上时,面板则让出这个快捷键。
      这里的示例关掉了快捷键,以免和本站顶部的搜索冲突。
    </p>
    <Demo title="Responsive.vue" :source="ResponsiveSrc"><Responsive /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunCommandSearch.props" />

    <EventsTable :rows="meta.KunCommandSearch.events" />
    <SlotsTable :rows="meta.KunCommandSearch.slots" />
  </article>
</template>
