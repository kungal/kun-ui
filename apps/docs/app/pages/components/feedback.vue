<script setup lang="ts">
import Toast from '~/examples/feedback/Toast.vue'
import ToastSrc from '~/examples/feedback/Toast.vue?raw'
import Alert from '~/examples/feedback/Alert.vue'
import AlertSrc from '~/examples/feedback/Alert.vue?raw'
import Loli from '~/examples/feedback/Loli.vue'
import LoliSrc from '~/examples/feedback/Loli.vue?raw'

const setup = `<!-- Mount each host ONCE near your app root (e.g. app.vue). -->
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
    <p class="text-default-600 mt-3 text-lg">
      Toasts, confirm dialogs and the mascot are <strong>store + provider</strong>
      systems: mount each host once, then trigger from anywhere with a composable —
      no component instance needed.
    </p>

    <KunInfo
      class="mt-6"
      color="info"
      icon="lucide:info"
      title="Mount the providers once"
      description="Add the provider hosts near your app root. In a Nuxt app they (and the composables) are auto-imported."
    />
    <div class="mt-3">
      <Code lang="vue" :code="setup" />
    </div>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Toasts — useKunMessage()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunMessage(message, type, duration=3000, richText=false, position='top-center')</code>.
      With <code class="text-primary">richText=true</code> the message is raw HTML —
      sanitize it yourself.
    </p>
    <Demo title="Toast.vue" :source="ToastSrc"><Toast /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Confirm dialog — useKunAlert()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunAlert(opts?)</code> returns
      <code class="text-primary">Promise&lt;boolean&gt;</code>.
    </p>
    <Demo title="Alert.vue" :source="AlertSrc"><Alert /></Demo>

    <h2 class="mt-8 mb-1 text-xl font-semibold">Mascot — useKunLoliInfo()</h2>
    <p class="text-default-600 mb-1 text-sm">
      <code class="text-primary">useKunLoliInfo(message, durationSeconds?)</code>.
    </p>
    <Demo title="Loli.vue" :source="LoliSrc"><Loli /></Demo>
  </article>
</template>
