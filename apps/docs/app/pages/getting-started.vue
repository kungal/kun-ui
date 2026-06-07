<script setup lang="ts">
const installNuxt =
  'pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite'
const installVue =
  'pnpm add @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens tailwindcss @tailwindcss/vite'

const nuxtConfig = `// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@kungal/ui-nuxt'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
})`

const cssEntry = `@import 'tailwindcss';
@import '@kungal/ui-tokens';
@import '@kungal/ui-vue/style.css';

/* 生成组件用到的工具类(路径相对本文件,指向 node_modules) */
@source '../../node_modules/@kungal/ui-vue';
@source '../../node_modules/@kungal/ui-core';`

const vueMain = `import { createApp } from 'vue'
import { KunUI } from '@kungal/ui-vue'
import App from './App.vue'
import './assets/main.css'

createApp(App).use(KunUI).mount('#app')`

const providers = `<!-- 在 app.vue 等应用根部各挂载一次 -->
<KunMessageProvider />
<KunAlertProvider />
<KunLoliProvider />`

const darkToggle = `document.documentElement.classList.toggle('kun-dark-mode', isDark)`
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">快速开始</h1>
    <p class="text-default-600 mt-3 text-lg">几分钟把 KunUI 接入你的 Vue / Nuxt 项目。</p>

    <h2 class="mt-10 mb-2 text-xl font-semibold">安装(Nuxt)</h2>
    <Code lang="bash" :code="installNuxt" />
    <p class="text-default-600 mt-3">在 <code class="text-primary">nuxt.config</code> 中 extends 这个 Layer,并配置 CSS 入口:</p>
    <div class="mt-3"><Code lang="ts" :code="nuxtConfig" /></div>
    <p class="text-default-600 mt-3"><code class="text-primary">app/assets/css/main.css</code>:</p>
    <div class="mt-3"><Code lang="css" :code="cssEntry" /></div>

    <h2 class="mt-10 mb-2 text-xl font-semibold">安装(纯 Vue)</h2>
    <Code lang="bash" :code="installVue" />
    <div class="mt-3"><Code lang="ts" :code="vueMain" /></div>
    <p class="text-default-600 mt-3">
      <code class="text-primary">main.css</code> 与 Nuxt 相同(tailwindcss + @kungal/ui-tokens +
      @kungal/ui-vue/style.css + 两条 @source)。
    </p>

    <h2 class="mt-10 mb-2 text-xl font-semibold">挂载反馈 Provider(可选)</h2>
    <p class="text-default-600 mb-3">若用到 toast / 确认弹窗 / 看板娘,在应用根部各挂载一次:</p>
    <Code lang="vue" :code="providers" />

    <h2 class="mt-10 mb-3 text-xl font-semibold">核心规则</h2>
    <div class="flex flex-col gap-3">
      <KunInfo
        color="warning"
        icon="lucide:triangle-alert"
        title="HTML 永不被 sanitize"
        description="把不可信 HTML 传给 KunContent 或 richText 消息前,请自行 sanitize(如 DOMPurify)。KunUI 不内置任何 sanitizer。"
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="图标全部内置,绝不联网获取"
        description="KunIcon 从注册表渲染内联 SVG,运行时不调用 Iconify。自定义图标用 @kungal/ui-core 的 registerKunIcon(s) 注册。"
      />
      <KunInfo
        color="info"
        icon="lucide:info"
        title="Tailwind 入口由你自己拥有"
        description="应用 CSS 需 import tailwindcss + @kungal/ui-tokens + @kungal/ui-vue/style.css,并 @source 这些包;pnpm 下三者需作为直接依赖安装。"
      />
    </div>

    <h2 class="mt-10 mb-2 text-xl font-semibold">暗色模式</h2>
    <p class="text-default-600 mb-3">在 <code class="text-primary">&lt;html&gt;</code> 上切换 <code class="text-primary">kun-dark-mode</code> 类即可:</p>
    <Code lang="ts" :code="darkToggle" />

    <h2 class="mt-10 mb-3 text-xl font-semibold">下一步</h2>
    <div class="flex flex-wrap items-center gap-4">
      <KunButton color="primary" href="/components/button">
        浏览组件 <KunIcon name="lucide:arrow-right" class="ml-1" />
      </KunButton>
      <KunLink
        href="https://github.com/kungal/kun-ui/blob/main/docs/INTEGRATION.md"
        target="_blank"
        color="default"
        underline="none"
      >
        完整集成指南 ↗
      </KunLink>
    </div>
  </article>
</template>
