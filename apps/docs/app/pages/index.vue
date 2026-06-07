<script setup lang="ts">
import { site } from '~/site.config'

const installCmd =
  'pnpm add @kungal/ui-nuxt @kungal/ui-vue @kungal/core @kungal/tokens tailwindcss @tailwindcss/vite'

const features = [
  { icon: 'lucide:zap', title: 'SSR 优先 · 高性能', desc: '全部组件 SSR 安全、水合零报错,极低运行时开销。' },
  { icon: 'lucide:layout-grid', title: '53 个组件', desc: '表单、浮层、反馈、展示、人物 —— 一应俱全。' },
  { icon: 'lucide:palette', title: '设计令牌 + 框架无关核心', desc: '@kungal/tokens 与 @kungal/core,跨框架视觉与 API 一致。' },
  { icon: 'lucide:wifi-off', title: '图标全内置 · 绝不联网', desc: '内联 SVG 渲染,运行时绝不请求 Iconify。' },
  { icon: 'lucide:moon', title: '暗色模式 · 类型安全', desc: '.kun-dark-mode 一键切换,完整 TypeScript 类型。' },
  { icon: 'lucide:bot', title: 'AI 友好', desc: '内置 llms.txt,Claude Code / Cursor 可直接读懂、用对。' },
]

const showcase = [
  { name: '鲲 Galgame 论坛', url: 'https://www.kungal.com', desc: 'Galgame 中文社区论坛 —— 由 KunUI 构建。' },
  { name: '鲲 Galgame 补丁', url: 'https://www.moyu.moe', desc: 'Galgame 补丁 / 资源分享站 —— 由 KunUI 构建。' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div class="relative mx-auto max-w-5xl px-6 pt-14 pb-10 text-center">
        <KunChip color="primary" variant="flat">Vue 3 · Nuxt 4 · 已发布 v0.2</KunChip>
        <h1 class="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">
          Kun<span class="text-primary">UI</span>
        </h1>
        <p class="text-primary mt-3 text-xl font-medium sm:text-2xl">{{ site.slogan }}</p>
        <p class="text-default-600 mx-auto mt-4 max-w-2xl text-lg">
          面向 Vue、Nuxt 的现代组件库(React、Next.js、SolidJS、SolidStart 规划中)——
          极致 SSR 支持、超低延迟、零外部依赖、生产就绪,助你更快交付 Web 应用。
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <KunButton color="primary" size="lg" href="/components/button">浏览组件 →</KunButton>
          <KunButton
            variant="bordered"
            size="lg"
            href="https://github.com/kungal/kun-ui"
            target="_blank"
          >
            GitHub
          </KunButton>
          <KunButton
            variant="light"
            size="lg"
            href="https://www.npmjs.com/package/@kungal/ui-vue"
            target="_blank"
          >
            npm
          </KunButton>
        </div>

        <KunImageNative
          src="/banner.webp"
          alt="KunUI —— 专为 ACGN 网站设计的现代无头 UI 组件库"
          class-name="mx-auto mt-12 w-full max-w-4xl"
          :width="1920"
          :height="1080"
        />
      </div>
    </section>

    <!-- Support status -->
    <section class="mx-auto max-w-5xl px-6 py-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <KunInfo
          color="success"
          icon="lucide:circle-check"
          title="现已支持 · Vue 3 / Nuxt 4"
          description="已发布到 npm,生产可用:53 个组件、设计令牌与核心、全部内置图标。"
        />
        <KunInfo
          color="info"
          icon="lucide:info"
          title="规划中 · React / Next.js / SolidJS / SolidStart"
          description="复用同一套令牌与核心,确保跨框架视觉与 API 一致;尚未发布,敬请期待。"
        />
      </div>
    </section>

    <!-- Features -->
    <section class="border-default-200 bg-content1/30 border-y">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <h2 class="text-center text-3xl font-bold tracking-tight">为什么选择 KunUI</h2>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KunCard v-for="f in features" :key="f.title" is-hoverable class-name="h-full">
            <KunIcon :name="f.icon" class="text-primary text-3xl" />
            <h3 class="mt-3 text-lg font-semibold">{{ f.title }}</h3>
            <p class="text-default-600 mt-1 text-sm leading-relaxed">{{ f.desc }}</p>
          </KunCard>
        </div>
      </div>
    </section>

    <!-- Showcase -->
    <section class="mx-auto max-w-6xl px-6 py-14">
      <h2 class="text-center text-3xl font-bold tracking-tight">谁在使用 KunUI</h2>
      <p class="text-default-500 mt-2 text-center">这些线上站点(包括本文档站)都由 KunUI 构建。</p>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          v-for="s in showcase"
          :key="s.url"
          :href="s.url"
          target="_blank"
          rel="noopener"
          class="block"
        >
          <KunCard is-hoverable class-name="h-full">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ s.name }}</h3>
              <KunIcon name="lucide:external-link" class="text-default-400" />
            </div>
            <p class="text-primary mt-0.5 text-sm">{{ s.url.replace('https://', '') }}</p>
            <p class="text-default-600 mt-2 text-sm">{{ s.desc }}</p>
          </KunCard>
        </a>
      </div>
    </section>

    <!-- Resources -->
    <section class="border-default-200 bg-content1/30 border-y">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <h2 class="text-center text-3xl font-bold tracking-tight">资源与社区</h2>
        <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink to="/components/button" class="block">
            <KunCard is-hoverable class-name="h-full"><span class="text-2xl">📚</span>
              <h3 class="mt-2 font-semibold">组件文档</h3>
              <p class="text-default-600 mt-1 text-sm">53 个组件的示例与属性。</p>
            </KunCard>
          </NuxtLink>
          <a href="https://github.com/kungal/kun-ui" target="_blank" rel="noopener" class="block">
            <KunCard is-hoverable class-name="h-full"><span class="text-2xl">⭐</span>
              <h3 class="mt-2 font-semibold">GitHub</h3>
              <p class="text-default-600 mt-1 text-sm">源码、Issue 与发布(AGPL-3.0)。</p>
            </KunCard>
          </a>
          <a href="https://www.npmjs.com/package/@kungal/ui-vue" target="_blank" rel="noopener" class="block">
            <KunCard is-hoverable class-name="h-full"><span class="text-2xl">📦</span>
              <h3 class="mt-2 font-semibold">npm</h3>
              <p class="text-default-600 mt-1 text-sm">@kungal scope 下的四个包。</p>
            </KunCard>
          </a>
          <a href="/llms.txt" class="block">
            <KunCard is-hoverable class-name="h-full"><span class="text-2xl">🤖</span>
              <h3 class="mt-2 font-semibold">llms.txt</h3>
              <p class="text-default-600 mt-1 text-sm">给 AI 工具的机器可读文档。</p>
            </KunCard>
          </a>
        </div>
      </div>
    </section>

    <!-- Install -->
    <section class="mx-auto max-w-3xl px-6 py-14">
      <h2 class="text-center text-3xl font-bold tracking-tight">几分钟即可上手</h2>
      <p class="text-default-600 mt-4">
        Nuxt:<code class="text-primary">extends: ['@kungal/ui-nuxt']</code>,然后安装依赖:
      </p>
      <div class="mt-3"><Code lang="bash" :code="installCmd" /></div>
      <div class="mt-7 text-center">
        <KunButton color="primary" size="lg" href="/components/button">查看全部组件 →</KunButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-default-200 border-t">
      <div
        class="text-default-500 mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm sm:flex-row"
      >
        <span>© 2026 KunUI · AGPL-3.0 · kungal</span>
        <span class="flex items-center gap-4">
          <KunLink href="https://github.com/kungal/kun-ui" target="_blank" color="default" underline="none">GitHub</KunLink>
          <KunLink href="https://www.npmjs.com/package/@kungal/ui-vue" target="_blank" color="default" underline="none">npm</KunLink>
          <KunLink href="https://www.kungal.com" target="_blank" color="default" underline="none">kungal.com</KunLink>
          <KunLink href="https://www.moyu.moe" target="_blank" color="default" underline="none">moyu.moe</KunLink>
        </span>
      </div>
    </footer>
  </div>
</template>
