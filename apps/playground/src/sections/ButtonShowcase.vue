<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIVariant, KunUIColor, KunUISize } from '@kungal/ui-core'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const variants: KunUIVariant[] = [
  'solid',
  'bordered',
  'light',
  'flat',
  'shadow',
]
const colors: KunUIColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']

// Split button (GitHub-style Star + 收藏夹 dropdown)
const starred = ref(false)
const lists = ref<string[]>(['favorites'])
const listOptions = ref<KunCheckBoxGroupOption[]>([
  { value: 'favorites', label: 'Favorites' },
  { value: 'galgame', label: 'Galgame 精选', description: '12 项' },
  { value: 'toplay', label: '待玩', description: '4 项' },
])
const creating = ref(false)
const newList = ref('')
const createList = () => {
  const name = newList.value.trim()
  if (!name || listOptions.value.some((o) => o.value === name)) return
  listOptions.value.push({ value: name, label: name })
  lists.value.push(name)
  newList.value = ''
  creating.value = false
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Button — variant × color</h2>

    <div class="flex flex-col gap-3">
      <div v-for="variant in variants" :key="variant" class="flex flex-col gap-1">
        <span class="text-default-500 text-xs uppercase">{{ variant }}</span>
        <div class="flex flex-wrap items-center gap-2">
          <KunButton
            v-for="color in colors"
            :key="color"
            :variant="variant"
            :color="color"
          >
            {{ color }}
          </KunButton>
        </div>
      </div>
    </div>

    <h3 class="mt-2 text-base font-medium">Sizes</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton v-for="size in sizes" :key="size" :size="size">
        {{ size }}
      </KunButton>
    </div>

    <h3 class="mt-2 text-base font-medium">States</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton :loading="true">Loading</KunButton>
      <KunButton :disabled="true">Disabled</KunButton>
      <KunButton color="success" variant="flat">Ripple me</KunButton>
      <KunButton href="https://example.com" target="_blank" variant="light">
        Link (renders &lt;a&gt;)
      </KunButton>
      <KunButton color="danger" :is-icon-only="true" aria-label="delete">
        <template #icon><span>✕</span></template>
      </KunButton>
    </div>

    <h3 class="mt-2 text-base font-medium">Rounded</h3>
    <div class="flex flex-wrap items-center gap-2">
      <KunButton rounded="none">none</KunButton>
      <KunButton rounded="sm">sm</KunButton>
      <KunButton rounded="md">md</KunButton>
      <KunButton rounded="lg">lg</KunButton>
      <KunButton rounded="full">full</KunButton>
    </div>

    <div class="max-w-md">
      <KunButton :full-width="true" color="secondary">Full width</KunButton>
    </div>

    <h3 class="mt-2 text-base font-medium">ButtonGroup — segmented</h3>
    <div class="flex flex-wrap items-center gap-4">
      <KunButtonGroup aria-label="alignment">
        <KunButton variant="bordered">Left</KunButton>
        <KunButton variant="bordered">Center</KunButton>
        <KunButton variant="bordered">Right</KunButton>
      </KunButtonGroup>
      <KunButtonGroup aria-label="pagination">
        <KunButton color="primary">One</KunButton>
        <KunButton color="primary">Two</KunButton>
        <KunButton color="primary">Three</KunButton>
      </KunButtonGroup>
    </div>

    <h3 class="mt-2 text-base font-medium">
      Split button — GitHub-style Star + 收藏夹
    </h3>
    <div class="flex flex-wrap items-center gap-4">
      <KunButtonGroup aria-label="star this project">
        <!-- Left: primary action — star directly -->
        <KunButton
          :variant="starred ? 'flat' : 'bordered'"
          :color="starred ? 'warning' : 'default'"
          @click="starred = !starred"
        >
          <span class="mr-1">{{ starred ? '★' : '☆' }}</span>
          {{ starred ? 'Starred' : 'Star' }}
          <span class="text-default-400 ml-2 tabular-nums">
            {{ 1280 + (starred ? 1 : 0) }}
          </span>
        </KunButton>

        <!-- Right: chevron opens the 收藏夹 dropdown -->
        <KunPopover position="bottom-end" rounded="lg" opaque>
          <template #trigger>
            <KunButton
              :variant="starred ? 'flat' : 'bordered'"
              :color="starred ? 'warning' : 'default'"
              :is-icon-only="true"
              aria-label="加入收藏夹"
            >
              <KunIcon name="lucide:chevron-down" />
            </KunButton>
          </template>

          <div class="w-64 space-y-2 p-1">
            <p class="px-2 pt-1 text-sm font-medium">添加到收藏夹</p>
            <KunCheckBoxGroup
              v-model="lists"
              :options="listOptions"
              color="warning"
              class-name="max-h-56 overflow-y-auto px-1"
            />
            <KunDivider />
            <KunButton
              v-if="!creating"
              variant="light"
              :full-width="true"
              class-name="justify-start"
              @click="creating = true"
            >
              <KunIcon name="lucide:plus" class="mr-1" /> 创建收藏夹
            </KunButton>
            <div v-else class="flex items-center gap-2 px-1">
              <KunInput
                v-model="newList"
                placeholder="收藏夹名称"
                size="sm"
                @keydown.enter="createList"
              />
              <KunButton size="sm" color="primary" @click="createList">
                创建
              </KunButton>
            </div>
          </div>
        </KunPopover>
      </KunButtonGroup>

      <span class="text-default-500 text-sm">
        已加入: {{ lists.join(', ') || '（无）' }}
      </span>
    </div>

    <h3 class="mt-2 text-base font-medium">ButtonGroup — vertical</h3>
    <KunButtonGroup
      orientation="vertical"
      aria-label="vertical actions"
      class-name="w-32"
    >
      <KunButton variant="bordered">Top</KunButton>
      <KunButton variant="bordered">Middle</KunButton>
      <KunButton variant="bordered">Bottom</KunButton>
    </KunButtonGroup>
  </section>
</template>
