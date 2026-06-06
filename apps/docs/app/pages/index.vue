<script setup lang="ts">
const installCmd =
  'pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/core @kungal/tokens tailwindcss @tailwindcss/vite'

const cssEntry = `@import 'tailwindcss';
@import '@kungal/tokens';
@import '@kungal/ui-vue/style.css';

/* 生成组件用到的工具类 */
@source '../../node_modules/@kungal/ui-vue';
@source '../../node_modules/@kungal/core';`
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">
      Kun<span class="text-primary">UI</span>
    </h1>
    <p class="text-default-600 mt-3 text-lg">
      跨框架(Vue / Nuxt)组件库 —— 53 个基于 Tailwind v4 的组件、与框架无关的核心与设计令牌,并提供 Nuxt 层。
      <span class="text-foreground font-medium">这个站点本身就是用 KunUI 构建的。</span>
    </p>

    <h2 class="mt-10 mb-3 text-xl font-semibold">核心规则</h2>
    <div class="flex flex-col gap-3">
      <KunInfo
        color="warning"
        icon="lucide:triangle-alert"
        title="HTML 永不被 sanitize"
        description="把不可信 HTML 传给 KunContent 或 richText 消息前,请自行 sanitize。KunUI 不内置任何 sanitizer(为 SSR 安全而刻意如此)。"
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="图标全部内置,绝不联网获取"
        description="KunIcon 从注册表渲染内联 SVG —— 运行时不调用 Iconify。自定义图标用 registerKunIcon(s) 注册。"
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="Tailwind 入口由你自己拥有"
        description="你的应用 CSS 需 import tailwindcss + @kungal/tokens + @kungal/ui-vue/style.css,并 @source 这些包。"
      />
    </div>

    <h2 class="mt-10 mb-3 text-xl font-semibold">安装(Nuxt)</h2>
    <Code lang="bash" :code="installCmd" />
    <p class="text-default-600 mt-3">
      在 <code class="text-primary">nuxt.config</code> 中加入
      <code class="text-primary">extends: ['@kungal/ui-nuxt']</code>,然后配置 CSS 入口:
    </p>
    <Code lang="css" :code="cssEntry" />

    <div class="mt-8">
      <KunButton color="primary" href="/components/button">浏览组件 →</KunButton>
    </div>
  </article>
</template>
