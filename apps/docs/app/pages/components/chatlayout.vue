<script setup lang="ts">
import App from '~/examples/chatlayout/App.vue'
import AppSrc from '~/examples/chatlayout/App.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-5xl">
    <DocTitle />
    <DocIntro />

    <h2 class="mt-10 mb-1 text-xl font-semibold">完整的聊天界面</h2>
    <p class="text-default-500 mb-2 text-sm">
      列表、会话头、置顶条、消息列表与输入区拼在一起。发一条消息看看发送中 → 已发送 → 对方已读;
      你发的第三条会失败,点气泡旁的红色按钮重试。布局<strong>自身</strong>窄于 48rem(768px)时只显示一栏,
      点左上角返回切换——和 App 一致;放在侧栏旁边时按实际可用的宽度判断,而不是窗口。这里加了
      <code>resizable</code>,拖动列表右侧的分隔线可以调整列表宽度。
    </p>
    <Demo title="App.vue" :source="AppSrc"><App /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunChatLayout.props" />
    <EventsTable :rows="meta.KunChatLayout.events" />
    <SlotsTable :rows="meta.KunChatLayout.slots" />
  </article>
</template>
