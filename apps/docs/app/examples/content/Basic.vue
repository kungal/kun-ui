<script setup lang="ts">
// Trusted, author-written HTML. For user/untrusted HTML, sanitize it yourself
// first (e.g. DOMPurify) — KunContent does NOT sanitize.
const html =
  '<h3>Rich content</h3><p>KunContent renders trusted HTML, with <strong>spoiler</strong> and inline-image lightbox support.</p>'
</script>

<template>
  <KunContent :content="html" />
</template>
