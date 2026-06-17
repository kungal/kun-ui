<script setup lang="ts">
import changelog from '~/generated/changelog.json'

// Auto-generated from @kungal/ui-vue's CHANGELOG.md (see scripts/gen-changelog.mjs),
// refreshed on every release. The HTML is pre-rendered at build time from our own
// changelog (trusted content), so v-html is safe here.
useKunSeoMeta()

type Type = 'major' | 'minor' | 'patch'
const chip: Record<Type, { color: string; label: string }> = {
  major: { color: 'danger', label: 'Major' },
  minor: { color: 'primary', label: 'Minor' },
  patch: { color: 'default', label: 'Patch' },
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h1 class="text-2xl font-bold">更新日志</h1>
    <p class="text-default-600 mt-2 mb-6">
      KunUI 各版本变更(四个包
      <code class="text-sm">ui-tokens / ui-core / ui-vue / ui-nuxt</code>
      锁步同版本)。每条都源自该次发布的 changeset,**随发布自动生成**,无需手写。
    </p>

    <KunAccordion
      variant="splitted"
      multiple
      :default-value="changelog[0]?.version"
    >
      <KunAccordionItem
        v-for="entry in changelog"
        :key="entry.version"
        :value="entry.version"
      >
        <template #title>
          <span class="flex items-center gap-2.5">
            <span class="font-semibold">v{{ entry.version }}</span>
            <KunChip
              size="sm"
              variant="flat"
              :color="chip[entry.type as Type].color"
            >
              {{ chip[entry.type as Type].label }}
            </KunChip>
          </span>
        </template>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-if="entry.html"
          class="kun-prose kun-prose-compact"
          v-html="entry.html"
        />
        <p v-else class="text-default-400 text-sm">随依赖更新。</p>
      </KunAccordionItem>
    </KunAccordion>
  </div>
</template>
