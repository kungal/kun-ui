<script setup lang="ts">
import { site } from '~/site.config'

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
    <h1 class="text-4xl font-bold tracking-tight">
      Kun<span class="text-primary">UI</span>
    </h1>
    <p class="text-primary mt-2 text-lg font-medium">{{ site.slogan }}</p>
    <p class="text-default-600 mt-4 text-lg">
      面向 <span class="text-foreground font-medium">Vue</span>、<span class="text-foreground font-medium">Nuxt</span>
      的现代组件库(React、Next.js、SolidJS、SolidStart 规划中)—— 极致 SSR 支持、超低延迟、零外部依赖、生产就绪,助你更快交付 Web 应用。
      <span class="text-foreground font-medium">这个站点本身就是用 KunUI 构建的。</span>
    </p>

    <h2 class="mt-10 mb-3 text-xl font-semibold">支持情况</h2>
    <div class="flex flex-col gap-3">
      <KunInfo
        color="success"
        icon="lucide:circle-check"
        title="现已支持 · Vue 3 / Nuxt 4"
        description="已发布到 npm,生产可用:53 个组件、与框架无关的设计令牌与核心、全部内置图标。"
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="规划中 · React / Next.js / SolidJS / SolidStart"
        description="将复用同一套 @kungal/tokens 设计令牌与 @kungal/core 核心,确保跨框架的视觉与 API 一致;尚未发布,敬请期待。"
      />
    </div>

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
