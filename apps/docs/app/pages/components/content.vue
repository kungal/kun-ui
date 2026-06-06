<script setup lang="ts">
import Basic from '~/examples/content/Basic.vue'
import BasicSrc from '~/examples/content/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Content</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunContent&gt;</code> — renders an HTML
      <code class="text-primary">content</code> string (via v-html) with spoiler and
      inline-image lightbox enhancements.
    </p>

    <KunInfo
      class="mt-6"
      color="danger"
      icon="lucide:triangle-alert"
      title="KunContent does NOT sanitize HTML"
      description="It renders exactly what you pass. Sanitize any untrusted / user-provided HTML yourself (e.g. DOMPurify) before binding it to content."
    />

    <h2 class="mt-10 mb-1 text-xl font-semibold">Basic</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunContent.props" />
  </article>
</template>
