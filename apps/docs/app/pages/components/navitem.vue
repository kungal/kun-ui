<script setup lang="ts">
import Rail from '~/examples/navitem/Rail.vue'
import RailSrc from '~/examples/navitem/Rail.vue?raw'
import Sidebar from '~/examples/navitem/Sidebar.vue'
import SidebarSrc from '~/examples/navitem/Sidebar.vue?raw'
import Badge from '~/examples/navitem/Badge.vue'
import BadgeSrc from '~/examples/navitem/Badge.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <DocTitle />
    <DocIntro />

    <p class="text-default-600 mt-4 text-sm leading-relaxed">
      KunNavItem 只是导航里的一项,不包含容器:侧轨、侧边栏还是底栏,由应用自己排布。
      它不读取路由,哪一项是当前页由应用通过 <code>current</code> 决定。
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">侧轨(stacked)</h2>
    <Demo title="Rail.vue" :source="RailSrc"><Rail /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">侧边栏</h2>
    <Demo title="Sidebar.vue" :source="SidebarSrc"><Sidebar /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">带徽标的图标</h2>
    <Demo title="Badge.vue" :source="BadgeSrc"><Badge /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">属性</h2>
    <PropsTable :rows="meta.KunNavItem.props" />

    <EventsTable :rows="meta.KunNavItem.events" />
    <SlotsTable :rows="meta.KunNavItem.slots" />
  </article>
</template>
