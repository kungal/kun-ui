<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

const colors: KunUIColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]

const progress = ref(60)
const loadingDemo = ref(false)
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Chip · Badge · Progress · Info · Loading</h2>

    <h3 class="text-base font-medium">Chip</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunChip v-for="c in colors" :key="c" :color="c">{{ c }}</KunChip>
      <KunChip color="primary" variant="solid">solid</KunChip>
      <KunChip color="primary" variant="bordered">bordered</KunChip>
    </div>

    <h3 class="mt-2 text-base font-medium">Badge</h3>
    <div class="flex flex-wrap items-center gap-6">
      <KunBadge :count="5">
        <KunButton variant="bordered">Inbox</KunButton>
      </KunBadge>
      <KunBadge :count="120" :max="99" color="primary">
        <KunButton variant="bordered">Messages</KunButton>
      </KunBadge>
      <KunBadge variant="dot" color="success">
        <KunIcon name="lucide:info" class="text-2xl" />
      </KunBadge>
      <!-- standalone (no anchor slot) + accessible name -->
      <KunBadge :count="3" color="danger" aria-label="3 条未读" />
    </div>

    <h3 class="mt-2 text-base font-medium">Progress</h3>
    <div class="flex max-w-md flex-col gap-3">
      <KunProgress :value="progress" :show-label="true" />
      <KunProgress :value="progress" variant="gradient" color="secondary" />
      <KunProgress :value="progress" variant="striped" color="success" />
      <KunProgress :indeterminate="true" color="primary" aria-label="加载进度" />
      <div class="flex items-center gap-4">
        <KunProgress :value="progress" variant="circle" color="primary" :show-label="true" aria-label="进度" />
        <KunProgress :indeterminate="true" variant="circle" color="secondary" aria-label="加载中" />
        <KunButton size="sm" @click="progress = (progress + 20) % 120">+20</KunButton>
      </div>
    </div>

    <h3 class="mt-2 text-base font-medium">Info</h3>
    <div class="flex flex-col gap-2">
      <KunInfo color="primary" icon="lucide:info" title="Heads up" description="A primary info callout." />
      <KunInfo color="success" variant="flat" icon="lucide:circle-check" title="Success" description="Saved." />
      <KunInfo color="danger" variant="bordered" icon="lucide:circle-x" title="Error" description="Something failed." />
    </div>

    <h3 class="mt-2 text-base font-medium">Loading</h3>
    <div class="flex flex-col gap-2">
      <KunButton size="sm" variant="bordered" @click="loadingDemo = !loadingDemo">
        Toggle overlay
      </KunButton>
      <!-- No :src → shows the bundled default loading mascot. -->
      <KunLoading :loading="loadingDemo" description="加载中…">
        <KunCard color="default" class-name="h-32">
          <span>Content behind the loading overlay</span>
        </KunCard>
      </KunLoading>
      <!-- compact spinner variant -->
      <KunLoading :loading="true" :spinner="true" size="md" description="加载中" />
    </div>
  </section>
</template>
