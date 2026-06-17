<script setup lang="ts">
import guides from '~/generated/upgrade.json'

// The migration guides (docs/UPGRADE-*.md) rendered to HTML at build time (see
// scripts/gen-upgrade.mjs) — our own trusted content, so v-html is safe.
useKunSeoMeta()
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h1 class="text-2xl font-bold">升级与迁移</h1>
    <p class="text-default-600 mt-2 mb-4">
      逐版变更见<NuxtLink to="/changelog" class="text-primary">更新日志</NuxtLink>;本页是按版本跨度的**迁移指南**。
    </p>

    <KunInfo color="primary" variant="flat" class-name="mb-6">
      <template #title>还停在 0.5.2 或更早?</template>
      先做
      <a href="#v052-to-100" class="text-primary underline">0.5.2 → 1.0.0 破坏性迁移</a>,再看下面的 1.x 升级。
    </KunInfo>

    <!-- mini nav -->
    <nav class="mb-8 flex flex-wrap gap-2">
      <a
        v-for="g in guides"
        :key="g.slug"
        :href="`#${g.slug}`"
        class="border-kun text-default-600 hover:text-foreground rounded-kun-md border px-3 py-1.5 text-sm transition-colors"
      >
        {{ g.title }}
      </a>
    </nav>

    <section
      v-for="g in guides"
      :id="g.slug"
      :key="g.slug"
      class="kun-prose scroll-mt-20 border-default-200 mt-12 border-t pt-8 first:mt-0 first:border-0 first:pt-0"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="g.html" />
    </section>
  </div>
</template>
