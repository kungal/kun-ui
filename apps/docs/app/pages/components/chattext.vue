<script setup lang="ts">
import Basic from '~/examples/chattext/Basic.vue'
import BasicSrc from '~/examples/chattext/Basic.vue?raw'
import Spoiler from '~/examples/chattext/Spoiler.vue'
import SpoilerSrc from '~/examples/chattext/Spoiler.vue?raw'
import Preview from '~/examples/chattext/Preview.vue'
import PreviewSrc from '~/examples/chattext/Preview.vue?raw'
import Events from '~/examples/chattext/Events.vue'
import EventsSrc from '~/examples/chattext/Events.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">基础用法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      entities 的偏移与长度按 UTF-16 code unit 计,嵌套任意层;交叉、越界、切开 emoji 的区间都会先被
      <code>normalizeKunChatEntities</code> 规整,所以任何数据都能渲染。
    </p>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">剧透</h2>
    <Demo title="Spoiler.vue" :source="SpoilerSrc"><Spoiler /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">单行预览</h2>
    <Demo title="Preview.vue" :source="PreviewSrc"><Preview /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">接管链接与提及</h2>
    <Demo title="Events.vue" :source="EventsSrc"><Events /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">输入框快捷写法</h2>
    <p class="text-foreground-muted mb-2 text-sm">
      <code>parseKunChatMarkdown</code> 把输入框里的 <code>**粗**</code> <code>__斜__</code>
      <code>++下划线++</code> <code>~~删~~</code> <code>||剧透||</code> <code>`代码`</code>
      <code>```语言⏎代码⏎```</code> <code>[文字](链接)</code> <code>[文字](mention:ID)</code>
      与行首 <code>&gt; </code> 引用转成 text + entities;<code>formatKunChatMarkdown</code> 反过来,
      编辑已发消息或恢复草稿时用。两者互逆(url 实体由服务端重新识别,不写回)。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatText.props" />
    <EventsTable :rows="meta.KunChatText.events" />
    <SlotsTable :rows="meta.KunChatText.slots" />
  </article>
</template>
