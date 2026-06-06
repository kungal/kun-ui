<script setup lang="ts">
import Toast from '~/examples/feedback/Toast.vue'
import ToastSrc from '~/examples/feedback/Toast.vue?raw'
import Alert from '~/examples/feedback/Alert.vue'
import AlertSrc from '~/examples/feedback/Alert.vue?raw'
import Loli from '~/examples/feedback/Loli.vue'
import LoliSrc from '~/examples/feedback/Loli.vue?raw'

const setup = `<!-- 在应用根部(如 app.vue)各挂载一次即可。 -->
<template>
  <NuxtPage />
  <KunMessageProvider />
  <KunAlertProvider />
  <KunLoliProvider />
</template>`
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Feedback</h1>
    <DocIntro />

    <KunInfo
      class="mt-6"
      color="info"
      icon="lucide:info"
      title="Provider 只需挂载一次"
      description="把这些 Provider 宿主组件放在应用根部即可。在 Nuxt 应用中,它们(以及这些组合式)会被自动导入。"
    />
    <div class="mt-3">
      <Code lang="vue" :code="setup" />
    </div>

    <h2 class="mt-10 mb-1 text-xl font-semibold">消息提示 — useKunMessage()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunMessage(message, type, duration=3000, richText=false, position='top-center')</code>。
      当 <code class="text-primary">richText=true</code> 时,消息为原始 HTML —— 请自行 sanitize。
    </p>
    <Demo title="Toast.vue" :source="ToastSrc"><Toast /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">确认弹窗 — useKunAlert()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunAlert(opts?)</code> 返回
      <code class="text-primary">Promise&lt;boolean&gt;</code>(确认为 true,取消为 false)。
    </p>
    <Demo title="Alert.vue" :source="AlertSrc"><Alert /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">看板娘 — useKunLoliInfo()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunLoliInfo(message, durationSeconds?)</code>.
    </p>
    <Demo title="Loli.vue" :source="LoliSrc"><Loli /></Demo>
  </article>
</template>
