<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/core'

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

const demoImg = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/></svg>'
)}`
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
    </div>

    <h3 class="mt-2 text-base font-medium">Progress</h3>
    <div class="flex max-w-md flex-col gap-3">
      <KunProgress :value="progress" :show-label="true" />
      <KunProgress :value="progress" variant="gradient" color="secondary" />
      <KunProgress :value="progress" variant="striped" color="success" />
      <KunProgress :indeterminate="true" color="primary" />
      <div class="flex items-center gap-3">
        <KunProgress :value="progress" variant="circle" color="primary" :show-label="true" />
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
      <KunLoading :loading="loadingDemo" :src="demoImg" description="Loading…">
        <KunCard color="default" class-name="h-32">
          <span>Content behind the loading overlay</span>
        </KunCard>
      </KunLoading>
    </div>
  </section>
</template>
