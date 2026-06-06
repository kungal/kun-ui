<script setup lang="ts">
import { useKunMessage } from '@kungal/ui-vue'
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Message (toast)</h2>
    <p class="text-default-500 text-sm">
      Imperative <code>useKunMessage()</code> writes to a module store;
      <code>&lt;KunMessageProvider/&gt;</code> (mounted once in App.vue) renders
      it. Hover to pause, click fast to see de-dup count.
    </p>

    <div class="flex flex-wrap gap-2">
      <KunButton color="success" @click="useKunMessage('Saved successfully', 'success')">
        Success
      </KunButton>
      <KunButton color="danger" @click="useKunMessage('Something went wrong', 'error')">
        Error
      </KunButton>
      <KunButton color="warning" @click="useKunMessage('Heads up', 'warn')">
        Warn
      </KunButton>
      <KunButton color="primary" @click="useKunMessage('Just so you know', 'info')">
        Info
      </KunButton>
    </div>

    <div class="flex flex-wrap gap-2">
      <KunButton
        variant="bordered"
        @click="useKunMessage('Top-right toast', 'info', 3000, false, 'top-right')"
      >
        top-right
      </KunButton>
      <KunButton
        variant="bordered"
        @click="useKunMessage('Bottom-center toast', 'info', 3000, false, 'bottom-center')"
      >
        bottom-center
      </KunButton>
      <KunButton
        variant="bordered"
        @click="useKunMessage('Click me repeatedly', 'success')"
      >
        de-dup (count badge)
      </KunButton>
    </div>
  </section>
</template>
