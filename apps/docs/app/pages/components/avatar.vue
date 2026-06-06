<script setup lang="ts">
import Basic from '~/examples/avatar/Basic.vue'
import BasicSrc from '~/examples/avatar/Basic.vue?raw'
import meta from '~/generated/component-meta.json'
</script>

<template>
  <article class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold tracking-tight">Avatar</h1>
    <p class="text-default-600 mt-3 text-lg">
      <code class="text-primary">&lt;KunAvatar&gt;</code> — a user avatar from a
      <code class="text-primary">KunUser</code>; falls back to a sticker when the
      image is empty, and navigates to the user link on click.
    </p>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Sizes</h2>
    <Demo title="Basic.vue" :source="BasicSrc"><Basic /></Demo>

    <h2 class="mt-10 mb-1 text-xl font-semibold">Props</h2>
    <PropsTable :rows="meta.KunAvatar.props" />
  </article>
</template>
